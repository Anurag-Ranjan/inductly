import { ApiError } from '../utils/ApiError';
import { prisma } from '../utils/prisma';

const fetchDashboard = async (userId: number) => {
    const [user, memberships, applications, applicationCount, inductionCount] =
        await Promise.all([
            prisma.user.findUnique({ where: { id: userId } }),

            prisma.membership.findMany({
                where: { user_id: userId },
                include: {
                    club: {
                        select: {
                            id: true,
                            name: true,
                            logo: true
                        }
                    }
                }
            }),

            prisma.application.findMany({
                where: {
                    user_id: userId
                },
                orderBy: { created_at: 'desc' },
                include: {
                    induction: {
                        select: {
                            title: true
                        },
                        include: {
                            club: {
                                select: {
                                    id: true,
                                    name: true,
                                    logo: true
                                }
                            }
                        }
                    },
                    currentStage: {
                        select: {
                            name: true
                        }
                    },
                    stageProgress: {
                        select: {
                            status: true
                        }
                    }
                }
            }),

            prisma.application.count({
                where: { user_id: userId }
            }),

            prisma.membership.count({
                where: {
                    user_id: userId,
                    inducted_on: {
                        not: null
                    }
                }
            })
        ]);

    if (!user) throw new ApiError(404, 'User not found');

    const clubs = memberships.map((m) => ({
        clubId: m.club.id,
        name: m.club.name,
        logo: m.club.logo,
        role: m.role,
        inducted_on: m.inducted_on
    }));

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
        user,
        stats: {
            clubsInducted: inductionCount,
            applicationCount,
            hasActiveApplications: applicationCount > 0,
            isMemberOfAnyClub: memberships.length > 0
        },
        clubs,
        applications: formattedApplications
    };
};

export { fetchDashboard };
