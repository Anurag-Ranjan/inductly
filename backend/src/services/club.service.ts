import { tokenPayload } from '../types/jwt.types';
import { ApiError } from '../utils/ApiError';
import { getUserClubContext } from '../utils/getUserClubContext';
import { prisma } from '../utils/prisma';
import { ClubInput } from '../validations/club.validation';

const fetchAllClubs = async (page: number, limit: number, userId: number) => {
    const skip = (page - 1) * limit;
    const [clubs, total] = await Promise.all([
        prisma.membership.findMany({
            skip: skip,
            take: limit,
            orderBy: {
                inducted_on: 'asc'
            },
            where: {
                user_id: userId
            },

            select: {
                id: true,
                role: true,
                inducted_on: true,
                club: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        description: true
                    }
                }
            }
        }),
        prisma.membership.count({
            where: {
                inducted_on: {
                    not: null
                }
            }
        })
    ]);

    const totalPages = Math.ceil(total / limit);

    const formattedClubs = clubs.map((club) => {
        return {
            id: club.club.id,
            joined_on: club.inducted_on,
            role: club.role,
            club_name: club.club.name,
            logo: club.club.logo,
            description: club.club.description
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

const getVisitorView = async (clubId: number, userId: Number) => {
    const club = await getBaseClub(clubId);

    if (!club) return null;

    const now = new Date();

    const isInductionOpen = club?.inductions.some((ind) => {
        return ind.opened_on! <= now && ind.closing_on! >= now;
    });

    const members = await prisma.membership.findMany({
        where: {
            club_id: clubId
        },
        select: {
            user: {
                select: {
                    name: true,
                    email: true,
                    linkedin: true,
                    batch: true,
                    branch: true
                }
            },
            role: true
        }
    });

    return {
        ...club,
        isInductionOpen,
        members,
        role: 'VISITOR'
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
                    linkedin: true,
                    branch: true,
                    batch: true
                }
            }
        }
    });

    return {
        ...club,
        members,
        role: 'MEMBER'
    };
};

//admin view
// needs some changes

const getAdminView = async (clubId: number, userId: number) => {
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
                    id: true,
                    name: true,
                    profile_picture: true,
                    batch: true,
                    branch: true,
                    email: true,
                    linkedin: true
                }
            }
        }
    });

    return {
        ...club,
        members,
        role: 'ADMIN'
    };
};

const fetchClubDetails = async (
    role: string,
    user: tokenPayload,
    clubId: number
) => {
    if (role === 'VISITOR') {
        return getVisitorView(clubId, user.id);
    }

    if (role === 'MEMBER') {
        return getMemberView(clubId, user.id);
    }

    return getAdminView(clubId, user.id);
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

const updateClubDetails = async (clubDetails: ClubInput, clubId: number) => {
    const originalClub = await prisma.club.findUnique({
        where: {
            id: clubId
        }
    });

    if (!originalClub) throw new ApiError(404, 'Club not found');

    const { name, description, website, instagram, logo, linkedin, formed_on } =
        clubDetails;

    const updatedName = name ?? originalClub.name;
    const updatedDescription = description ?? originalClub.description;
    const updatedWebsite = website ?? originalClub.website;
    const updatedInstagram = instagram ?? originalClub.instagram;
    const updatedLogo = logo ?? originalClub.logo;
    const updatedLinked = linkedin ?? originalClub.linkedin;
    const updatedFormed_on = formed_on ?? originalClub.formed_on;

    const updatedClub = await prisma.club.update({
        where: {
            id: clubId
        },
        data: {
            name: updatedName,
            description: updatedDescription,
            website: updatedWebsite,
            instagram: updatedInstagram,
            logo: updatedLogo,
            linkedin: updatedLinked,
            formed_on: updatedFormed_on
        }
    });

    return updatedClub;
};

export { fetchAllClubs, fetchClubDetails, createClub, updateClubDetails };
