import { ApplicationStatus, MemberRole, StageStatus } from '@prisma/client';
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
    data: any
) => {
    const {
        status,
        notes,
        score
    }: { status: StageStatus; notes: string; score: number } = data;
    if (
        status.toUpperCase() !== StageStatus.PASSED &&
        status.toUpperCase() !== StageStatus.FAILED
    )
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

const moveApplicationToNextStageService = async (
    applicationId: number,
    clubId: number,
    stageId: number
) => {
    const application = await prisma.application.findFirst({
        where: {
            id: applicationId
        },
        select: {
            id: true,
            status: true,
            induction: {
                select: {
                    club_id: true,
                    stages: {
                        orderBy: {
                            order_index: 'asc'
                        },
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            currentStage: {
                select: {
                    id: true,
                    name: true
                }
            },
            stageProgress: {
                select: {
                    stage_id: true,
                    status: true
                }
            }
        }
    });

    if (!application) throw new ApiError(404, 'Application not found');

    if (clubId !== application.induction.club_id)
        throw new ApiError(403, 'Unauthorised');

    if (
        application.status === ApplicationStatus.REJECTED ||
        application.status === ApplicationStatus.ACCEPTED
    )
        throw new ApiError(
            401,
            'Cannot promote rejected or accepted candidates'
        );

    if (application.currentStage?.id !== stageId)
        throw new ApiError(401, 'Wrong stage id provided');

    const currentstageProgress = application.stageProgress.filter(
        (progress) => progress.stage_id === application.currentStage!.id
    );

    if (currentstageProgress[0]?.status !== StageStatus.PASSED)
        throw new ApiError(401, 'Applicant has not passed current stage');

    const currentStageIndex = application.induction.stages.findIndex(
        (stage) => stage.id === application.currentStage!.id
    );

    if (currentStageIndex === application.induction.stages.length - 1) {
        throw new ApiError(
            401,
            "Applicant already on last induction stage, can't move further"
        );
    }

    const nextStage = application.induction.stages[currentStageIndex + 1];

    const [nextStageData, updatedApplication] = await Promise.all([
        prisma.applicationStageProgress.create({
            data: {
                stage_id: nextStage?.id!,
                application_id: application.id
            }
        }),
        prisma.application.update({
            where: {
                id: application.id
            },
            data: {
                current_stage_id: nextStage?.id!
            }
        })
    ]);

    return nextStageData;
};

const getApplicationWithFormResponseService = async (
    applicationId: number,
    clubId: number
) => {
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
            }
        }
    });
    if (!application) throw new ApiError(404, 'Application not found');
    if (clubId !== application?.induction.club_id)
        throw new ApiError(403, 'Unauthorised');

    const requiredApplication = await prisma.application.findFirst({
        where: {
            id: application.id
        },
        select: {
            id: true,
            created_at: true,
            induction_id: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    profile_picture: true,
                    branch: true,
                    batch: true,
                    github: true,
                    linkedin: true
                }
            }
        }
    });

    const response = await prisma.formResponse.findFirst({
        where: {
            application_id: application.id
        }
    });

    if (!response) throw new ApiError(404, 'No response found');

    const form = await prisma.form.findFirst({
        where: {
            induction_id: requiredApplication!.induction_id
        },
        select: {
            questions: {
                orderBy: {
                    order_index: 'asc'
                },
                select: {
                    question_text: true,
                    question_type: true,
                    metadata: true,
                    answers: {
                        where: {
                            response_id: response?.id
                        }
                    }
                }
            }
        }
    });

    const returnData = {
        application_id: requiredApplication?.id,
        applied_on: requiredApplication?.created_at,
        applicant_name: requiredApplication?.user.name,
        applicant_email: requiredApplication!.user.email,
        applicant_profile_picture: requiredApplication!.user.profile_picture,
        applicant_branch: requiredApplication?.user.branch,
        applicant_batch: requiredApplication?.user.batch,
        applicant_github: requiredApplication?.user.github || 'Not Provided',
        applicant_linkedin:
            requiredApplication?.user.linkedin || 'Not Provided',
        form
    };

    return returnData;
};

const inductApplicantService = async (
    applicationId: number,
    clubId: number
) => {
    const application = await prisma.application.findFirst({
        where: {
            id: applicationId
        },
        select: {
            id: true,
            current_stage_id: true,
            user_id: true,
            induction: {
                select: {
                    id: true,
                    club_id: true
                }
            }
        }
    });

    if (!application) throw new ApiError(404, 'Application does not exist');

    if (application.induction.club_id !== clubId)
        throw new ApiError(
            403,
            'Unauthorised, induction does not belong to club'
        );

    const stages = await prisma.inductionStage.findMany({
        where: {
            induction_id: application.induction.id
        },
        orderBy: {
            order_index: 'asc'
        }
    });

    const applicant_stages = await prisma.applicationStageProgress.findMany({
        where: {
            application_id: application.id
        },
        select: {
            stage_id: true,
            status: true
        }
    });

    const currentStageProgress = applicant_stages.filter(
        (stage) => stage.stage_id === application.current_stage_id
    );

    const lastStageId = stages[stages.length - 1]?.id;

    if (currentStageProgress[0]?.stage_id !== lastStageId)
        throw new ApiError(401, 'Applicant not in the last pipeline stage');

    if (currentStageProgress[0]?.status !== 'PASSED')
        throw new ApiError(
            401,
            'Applicant has not passed the last induction stage'
        );

    const membership = await prisma.membership.create({
        data: {
            user_id: application.user_id,
            club_id: application.induction.club_id,
            role: MemberRole.MEMBER,
            inducted_on: new Date()
        }
    });

    if (!membership) throw new ApiError(500, 'Database Error');

    await prisma.application.update({
        where: {
            id: application.id
        },
        data: {
            status: ApplicationStatus.ACCEPTED
        }
    });

    return membership;
};

export {
    getMyApplicationsService,
    getApplicationDetailsService,
    scoreApplicantService,
    moveApplicationToNextStageService,
    getApplicationWithFormResponseService,
    inductApplicantService
};
