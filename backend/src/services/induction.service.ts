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

export { fetchInductions };
