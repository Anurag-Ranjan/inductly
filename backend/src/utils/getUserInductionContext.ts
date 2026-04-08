import { prisma } from '../utils/prisma';

export const getUserInductionContext = async (
    clubId: number,
    userId: number
) => {
    const membership = await prisma.membership.findFirst({
        where: {
            club_id: clubId,
            user_id: userId
        }
    });

    let context = 0;

    if (
        membership &&
        ['ADMIN', 'PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR'].includes(
            membership.role
        )
    )
        context = 1;
    return context;
};
