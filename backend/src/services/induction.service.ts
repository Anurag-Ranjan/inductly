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

export { fetchInductions, fetchInductionDetails };
