import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UserRole } from '../types/roles.types';
import { ApiError } from '../utils/ApiError';
import { getUserInductionContext } from '../utils/getUserInductionContext';
import { prisma } from '../utils/prisma';

const getUserInductionView = async (clubId: number, userId: number) => {
    const now = new Date();
    const inductions = await prisma.induction.findMany({
        where: {
            club_id: clubId,
            opened_on: {
                lte: now
            },
            closing_on: {
                gte: now
            }
        },
        include: {
            applications: {
                where: {
                    user_id: userId
                },
                select: {
                    id: true
                }
            }
        }
    });

    if (inductions.length === 0) throw new ApiError(404, 'No inductions found');

    const result = inductions.map((induction) => {
        return { ...induction, hasApplied: induction.applications.length != 0 };
    });

    return result;
};

const inductionStatus = (opened_on: Date | null, closing_on: Date | null) => {
    if (!opened_on || !closing_on) return 'DRAFT';
    if (closing_on >= new Date()) return 'ACTIVE';
    else return 'FINISHED';
};

const getAdminInductionView = async (clubId: number) => {
    const inductions = await prisma.induction.findMany({
        where: {
            club_id: clubId
        },
        include: {
            _count: {
                select: {
                    applications: true
                }
            }
        }
    });

    const formattedInductions = inductions.map((induction) => {
        return {
            ...induction,
            applicationCount: induction._count.applications,
            status: inductionStatus(induction.opened_on, induction.closing_on)
        };
    });

    return formattedInductions;
};

const fetchInductions = async (clubId: number, userId: number) => {
    const userContext = await getUserInductionContext(clubId, userId);

    if (userContext === 0) return getUserInductionView(clubId, userId);

    return getAdminInductionView(clubId);
};

const getUserInductionDetails = async (inductionId: number, userId: number) => {
    const induction = await prisma.induction.findUnique({
        where: {
            id: inductionId
        },
        include: {
            applications: {
                where: {
                    user_id: userId
                },
                select: {
                    id: true
                }
            },
            _count: {
                select: {
                    applications: true
                }
            }
        }
    });

    if (!induction) throw new ApiError(404, 'No induction found');

    return {
        id: induction.id,
        title: induction.title,
        description: induction.description,
        opened_on: induction.opened_on,
        closing_on: induction.closing_on,

        applicants: induction._count.applications,
        hasApplied: induction.applications.length > 0
    };
};

const getAdminInductionDetails = async (inductionId: number) => {
    // add pagination later

    const induction = await prisma.induction.findUnique({
        where: {
            id: inductionId
        },
        select: {
            id: true,
            title: true,
            description: true,
            opened_on: true,
            closing_on: true
        }
    });

    if (!induction) throw new ApiError(404, 'Induction does not exist');

    return induction;
};

const fetchInductionDetails = async (inductionId: number, role: UserRole) => {
    // if (role == UserRole.VISITOR) return getUserInductionDetails(inductionId);

    if (role == UserRole.ADMIN) return getAdminInductionDetails(inductionId);
};

const updateInductionDates = async (
    inductionId: number,
    opened_on: Date,
    closing_on: Date
) => {
    // I also need to implement this as a single transaction because when traffic would increase, then there is a potential risk of deletion before upfation by someone, a read followed by a write dependency exists

    const induction = await prisma.induction.findUnique({
        where: {
            id: inductionId
        },
        select: {
            forms: {
                select: {
                    id: true
                }
            },
            stages: {
                select: {
                    id: true
                }
            }
        }
    });

    if (!induction) throw new ApiError(404, 'Induction not found');

    if (induction.forms.length === 0 || induction.stages.length === 0)
        throw new ApiError(400, 'Cannot publish, please add stages and form');

    const publishedInduction = await prisma.induction.update({
        where: {
            id: inductionId
        },
        data: {
            opened_on,
            closing_on
        },
        select: {
            id: true,
            title: true,
            description: true,
            opened_on: true,
            closing_on: true
        }
    });

    if (!publishedInduction) throw new ApiError(500, 'Internal Database Error');

    return publishedInduction;
};

const fetchAllOpenInductions = async (page: number = 1, limit: number = 6) => {
    const now = new Date();
    const skip = (page - 1) * limit;

    const [inductions, total] = await Promise.all([
        prisma.induction.findMany({
            where: {
                opened_on: { not: null },
                closing_on: { gt: now }
            },
            include: {
                club: {
                    select: {
                        name: true,
                        logo: true
                    }
                },
                forms: {
                    select: { id: true },
                    take: 1
                }
            },
            orderBy: { created_at: 'desc' },
            skip,
            take: limit
        }),
        prisma.induction.count({
            where: {
                opened_on: { not: null },
                closing_on: { gt: now }
            }
        })
    ]);

    const data = inductions.map((induction) => {
        const publishedForm = induction.forms?.[0] ?? null;
        return {
            inductionId: induction.id,
            clubId: induction.club_id,
            clubName: induction.club.name,
            inductionTitle: induction.title,
            clubLogo: induction.club.logo,
            inductionDescription: induction.description,
            startDate: induction.opened_on,
            closeDate: induction.closing_on,
            formId: publishedForm?.id ?? null
        };
    });

    const totalPages = Math.ceil(total / limit);

    return {
        inductions: data,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};

const updateInductionDetailsService = async (params: {
    inductionId: number;
    title: string;
    description: string | undefined | null;
}) => {
    try {
        const induction = await prisma.induction.update({
            where: {
                id: params.inductionId
            },
            data: {
                title: params.title,
                description: params.description ? params.description : null
            },
            select: {
                title: true,
                description: true,
                id: true
            }
        });

        return induction;
    } catch (error: any) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2025'
        )
            throw new ApiError(404, 'Induction not found');
        throw new ApiError(500, error.message);
    }
};

const getInductionDashboardService = async (params: {
    inductionId: number;
    clubId: number;
}) => {
    const { inductionId, clubId } = params;

    const induction = await prisma.induction.findUnique({
        where: {
            id: inductionId
        },
        select: {
            title: true,
            opened_on: true,
            closing_on: true,
            club_id: true,
            id: true
        }
    });

    if (!inductionId) throw new ApiError(404, 'Induction not found');

    if (induction?.club_id !== clubId)
        throw new ApiError(
            403,
            'Unauthorised, induction does not belong to the club'
        );

    const applicants = await prisma.application.findMany({
        where: {
            induction_id: induction.id
        },
        orderBy: {
            created_at: 'asc'
        },
        select: {
            id: true,
            status: true,
            remarks: true,
            is_inducted: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    profile_picture: true
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
                    stage: {
                        select: {
                            id: true
                        }
                    },
                    status: true,
                    score: true
                }
            }
        }
    });

    const totalApplicants = applicants.length;

    const pendingApplicants = applicants.filter(
        (applicant) => applicant.status === 'PENDING'
    );

    const shortlistedApplicants = applicants.filter(
        (applicant) => applicant.status === 'SHORTLISTED'
    );

    const rejectedApplicants = applicants.filter(
        (applicant) => applicant.status === 'REJECTED'
    );

    const selectedApplicants = applicants.filter(
        (applicant) => applicant.status === 'ACCEPTED'
    );

    const formattedApplicants = applicants.map((applicant) => {
        return {
            application_id: applicant.id,
            name: applicant.user.name,
            applicant_email: applicant.user.email,
            profile_picture: applicant.user.profile_picture,
            status: applicant.status,
            remarks: applicant.remarks,
            is_inducted: applicant.is_inducted,
            currentStageId: applicant.currentStage?.id,
            currentStageName: applicant.currentStage?.name,
            currentStageStatus: applicant.stageProgress.filter(
                (stage) => stage.stage.id === applicant.currentStage!.id
            )[0]?.status,
            currentStageScore: applicant.stageProgress.filter(
                (stage) => stage.stage.id === applicant.currentStage!.id
            )[0]?.score
        };
    });

    const activeApplicants = formattedApplicants.filter((applicant) => {
        return (
            applicant.status !== 'ACCEPTED' && applicant.status !== 'REJECTED'
        );
    });

    return {
        induction,
        totalApplicants,
        pendingApplicants,
        shortlistedApplicants,
        selectedApplicants,
        rejectedApplicants,
        activeApplicants
    };
};

export {
    fetchInductions,
    fetchInductionDetails,
    updateInductionDates,
    fetchAllOpenInductions,
    updateInductionDetailsService,
    getInductionDashboardService
};
