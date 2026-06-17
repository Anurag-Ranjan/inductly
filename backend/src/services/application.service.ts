import { ApiError } from '../utils/ApiError';
import { prisma } from '../utils/prisma';

const getMyApplicationsService = async ({ userId }: { userId: number }) => {
    const applications = await prisma.application.findMany({
        where: {
            user_id: userId
        },
        orderBy: {
            created_at: 'desc'
        },
        select: {
            id: true,
            status: true,
            created_at: true,
            currentStage: {
                select: {
                    id: true,
                    name: true
                }
            },
            induction: {
                select: {
                    id: true,
                    title: true,
                    stages: {
                        orderBy: {
                            order_index: 'asc'
                        },
                        select: {
                            id: true
                        }
                    },
                    club: {
                        select: {
                            id: true,
                            name: true,
                            logo: true
                        }
                    }
                }
            }
        }
    });

    const formattedApplications = applications.map((application) => {
        return {
            id: application.id,
            status: application.status,
            applied_on: application.created_at,
            current_stage_id: application.currentStage?.id,
            current_stage_name: application.currentStage?.name,
            induction_id: application.induction.id,
            induction_title: application.induction.title,
            club_id: application.induction.club.id,
            club_logo: application.induction.club.logo,
            club_name: application.induction.club.name,
            stage_number: application.currentStage
                ? application.induction.stages.findIndex(
                      (s) => s.id === application.currentStage!.id
                  )
                : 0,
            totalStages: application.induction.stages.length
        };
    });

    return formattedApplications;
};

const getApplicationDetailsService = async (applicationId: number) => {
    const application = await prisma.application.findFirst({
        where: {
            id: applicationId
        },
        select: {
            id: true,
            created_at: true,
            status: true,
            remarks: true,
            induction: {
                select: {
                    stages: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            stageProgress: {
                select: {
                    id: true,
                    stage_id: true,
                    status: true,
                    score: true,
                    notes: true
                }
            }
        }
    });

    if (!application) throw new ApiError(404, 'Application not found');

    return application;
};

export { getMyApplicationsService, getApplicationDetailsService };
