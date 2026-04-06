import { prisma } from '../utils/prisma';

const fetchAllClubs = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [clubs, total] = await Promise.all([
        prisma.club.findMany({
            skip,
            take: limit,
            orderBy: {
                created_at: 'desc'
            },
            select: {
                id: true,
                name: true,
                description: true,
                logo: true,
                inductions: {
                    select: {
                        opened_on: true,
                        closing_on: true
                    }
                }
            }
        }),
        prisma.club.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    const formattedClubs = clubs.map((club) => {
        const now = new Date();

        const isOpenForInductions = club.inductions.some((ind) => {
            return (
                ind.opened_on &&
                ind.closing_on &&
                ind.opened_on <= now &&
                ind.closing_on >= now
            );
        });

        return {
            id: club.id,
            name: club.name,
            logo: club.logo,
            description: club.description,
            isInducting: isOpenForInductions
        };
    });

    return {
        clubs: formattedClubs,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};

export { fetchAllClubs };
