import { prisma } from './prisma';

export const getUserClubContext = async (
    userId: number | null,
    clubId: number
) => {
    // I have kept this just to be on the safer side, although this is going to be a protected route
    if (!userId) {
        return {
            role: 'VISITOR',
            accessLevel: 0,
            hasApplied: false
        };
    }

    const [membership, application] = await Promise.all([
        prisma.membership.findUnique({
            where: {
                user_id_club_id: {
                    user_id: userId,
                    club_id: clubId
                }
            }
        }),
        prisma.application.findFirst({
            where: {
                user_id: userId,
                club_id: clubId
            }
        })
    ]);

    const role = membership?.role || 'VISITOR';

    const accessLevel =
        role === 'ADMIN' || role === 'PRESIDENT'
            ? 2
            : role === 'MEMBER'
              ? 1
              : 0;

    return {
        role,
        accessLevel,
        hasApplied: !!application
    };
};
