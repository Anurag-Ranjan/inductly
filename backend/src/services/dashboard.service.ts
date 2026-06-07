import { ApplicationStatus } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../utils/prisma';

const fetchDashboard = async (userId: number) => {
    const [membershipCount, applicationCount, applicationStats, applications] =
        await Promise.all([
            prisma.membership.count({
                where: {
                    user_id: userId,
                    inducted_on: {
                        not: null
                    }
                }
            }),

            prisma.application.count({
                where: { user_id: userId }
            }),

            prisma.application.groupBy({
                by: ['status'],
                where: {
                    user_id: userId
                },
                _count: true
            }),

            prisma.application.findMany({
                where: {
                    user_id: userId
                },
                select: {
                    id: true,
                    status: true,

                    stageProgress: {
                        select: {
                            status: true
                        }
                    },

                    currentStage: {
                        select: {
                            name: true
                        }
                    },

                    induction: {
                        select: {
                            title: true,

                            club: {
                                select: {
                                    name: true,
                                    logo: true
                                }
                            }
                        }
                    }
                }
            })
        ]);

    const formattedApplications = applications.map((app) => {
        const completedStages = app.stageProgress.filter(
            (s) => s.status === 'PASSED'
        ).length;

        return {
            applicationId: app.id,
            club: {
                name: app.induction.club.name,
                logo: app.induction.club.logo
            },
            induction: {
                title: app.induction.title
            },
            status: app.status,
            currentStage: app.currentStage
                ? { name: app.currentStage.name }
                : null,
            progress: {
                totalStages: app.stageProgress.length,
                completedStages
            }
        };
    });

    return {
        stats: {
            membershipCount,
            applicationCount,
            applicationStats
        },
        applications: formattedApplications
    };
};

export { fetchDashboard };
