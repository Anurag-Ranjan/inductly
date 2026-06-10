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
            applicationCount: induction._count.applications
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
        include: {
            applications: {
                select: {
                    user: {
                        select: {
                            name: true,
                            profile_picture: true,
                            branch: true,
                            batch: true
                        }
                    },
                    created_at: true,
                    status: true,
                    is_inducted: true
                }
            }
        }
    });

    if (!induction) throw new ApiError(404, 'Induction does not exist');

    const formattedInduction = {
        ...induction,
        applicants: induction.applications.length
    };

    return formattedInduction;
};

const fetchInductionDetails = async (
    inductionId: number,
    userId: number,
    clubId: number
) => {
    const userContext = await getUserInductionContext(clubId, userId);

    if (userContext === 0) return getUserInductionDetails(inductionId, userId);

    return getAdminInductionDetails(inductionId);
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
        throw new ApiError(400, 'Induction is not complete');

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

    const data = inductions.map((induction) => ({
        inductionId: induction.id,
        clubId: induction.club_id,
        clubName: induction.club.name,
        inductionTitle: induction.title,
        clubLogo: induction.club.logo,
        inductionDescription: induction.description,
        startDate: induction.opened_on,
        closeDate: induction.closing_on
    }));

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

export { fetchInductions, fetchInductionDetails, updateInductionDates, fetchAllOpenInductions };
