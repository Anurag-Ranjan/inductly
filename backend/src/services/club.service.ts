import { ApiError } from '../utils/ApiError';
import { getUserClubContext } from '../utils/getUserClubContext';
import { prisma } from '../utils/prisma';
import { ClubInput } from '../validations/club.validation';

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

// base club fetcher
const getBaseClub = async (clubId: number) => {
    const club = await prisma.club.findUnique({
        where: {
            id: clubId
        },
        select: {
            id: true,
            name: true,
            description: true,
            logo: true,
            website: true,
            instagram: true,
            linkedin: true,
            inductions: {
                select: {
                    id: true,
                    opened_on: true,
                    closing_on: true
                }
            }
        }
    });

    return club;
};

//visitor level view

const getVisitorView = async (clubId: number, hasApplied: boolean) => {
    const club = await getBaseClub(clubId);

    if (!club) return null;

    const now = new Date();

    const isInductionOpen = club?.inductions.some((ind) => {
        return ind.opened_on! <= now && ind.closing_on! >= now;
    });

    return {
        ...club,
        canApply: isInductionOpen && !hasApplied,
        hasApplied
    };
};

// member level view

const getMemberView = async (clubId: number, userId: number) => {
    const club = await getBaseClub(clubId);
    if (!club) return null;

    const members = await prisma.membership.findMany({
        where: {
            club_id: clubId,
            user_id: {
                not: userId
            }
        },
        select: {
            role: true,
            user: {
                select: {
                    name: true,
                    profile_picture: true,
                    email: true,
                    mobile_number: true,
                    branch: true,
                    batch: true
                }
            }
        }
    });

    return {
        ...club,
        members
    };
};

//admin view
// needs some changes

const getAdminView = async (clubId: number) => {
    const club = await getBaseClub(clubId);
    if (!club) return null;

    const [members] = await prisma.membership.findMany({
        where: { club_id: clubId },
        select: {
            role: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    profile_pic: true
                }
            }
        }
    });
    return {
        ...club,
        members
    };
};

const fetchClubDetails = async (clubId: number, userId: number) => {
    const context = await getUserClubContext(userId, clubId);

    if (context.accessLevel === 0) {
        return getVisitorView(clubId, context.hasApplied);
    }

    if (context.accessLevel === 1) {
        return getMemberView(clubId, userId);
    }

    return getAdminView(clubId);
};

const createClub = async (data: ClubInput, creatorId: number) => {
    const existing = await prisma.club.findFirst({
        where: {
            name: data.name
        }
    });

    if (existing) throw new ApiError(400, 'Club already registered');

    const club = await prisma.club.create({
        data: {
            name: data.name,
            description: data.name || null,
            logo: data.logo || null,
            website: data.website || null,
            instagram: data.instagram || null,
            linkedin: data.linkedin || null,
            formed_on: data.formed_on || null
        }
    });

    if (!club) throw new ApiError(500, 'Cannot create club');

    await prisma.membership.create({
        data: {
            club_id: club.id,
            user_id: creatorId,
            role: 'ADMIN'
        }
    });

    return club;
};

export { fetchAllClubs, fetchClubDetails, createClub };
