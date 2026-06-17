import { ApplicationStatus, StageStatus } from '@prisma/client';
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

const scoreApplicantService = async (
    applicationId: number,
    clubId: number,
    stageId: number,
    data: {}
) => {
    const { status, notes, score }: any = data;
    if (status != StageStatus.PASSED || status != StageStatus.FAILED)
        throw new ApiError(401, 'Please provide correct status');
    const application = await prisma.application.findFirst({
        where: {
            id: applicationId
        },
        select: {
            id: true,
            induction: {
                select: {
                    club_id: true
                }
            },
            current_stage_id: true,
            status: true
        }
    });

    if (
        application?.status === ApplicationStatus.ACCEPTED ||
        application?.status === ApplicationStatus.REJECTED
    ) {
        throw new ApiError(401, 'Cannot score accepted or rejected candidates');
    }

    if (application?.induction.club_id !== clubId)
        throw new ApiError(403, 'Unauthorised');

    if (application.current_stage_id !== stageId)
        throw new ApiError(401, 'Cannot rank this stage');

    const updatedScore = await prisma.applicationStageProgress.update({
        where: {
            application_id_stage_id: {
                application_id: application.id,
                stage_id: application.current_stage_id
            }
        },
        data: {
            notes: notes,
            status: status,
            score: score
        }
    });

    if (updatedScore.status === StageStatus.FAILED) {
        await prisma.application.update({
            where: {
                id: application.id
            },
            data: {
                status: ApplicationStatus.REJECTED
            }
        });
    }

    if (updatedScore.status === StageStatus.PASSED) {
        await prisma.application.update({
            where: {
                id: application.id
            },
            data: {
                status: ApplicationStatus.SHORTLISTED
            }
        });
    }

    return updatedScore;
};

export {
    getMyApplicationsService,
    getApplicationDetailsService,
    scoreApplicantService
};
