import { RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import {
    createClub,
    fetchAllClubs,
    fetchClubDetails,
    updateClubDetails
} from '../services/club.service';
import { ClubInput, clubSchema } from '../validations/club.validation';
import { prisma } from '../utils/prisma';

const getAllClubs: RequestHandler = asyncHandler(async (req, res) => {
    console.log('Call made');
    if (!req.user) throw new ApiError(401, 'Unauthorised access');

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;

    const data = await fetchAllClubs(page, limit, req.user.id);

    return res
        .status(200)
        .json(new ApiResponse(200, data, 'Clubs fetched successfully'));
});

const getClubDetails: RequestHandler = asyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.id as string);
    const userId = req.user?.id;

    if (!clubId || !userId) throw new ApiError(401, 'Unauthorised Request');

    const club = await fetchClubDetails(clubId, userId);

    if (!club) throw new ApiError(404, 'Club not found');

    return res
        .status(200)
        .json(new ApiResponse(200, club, 'Club details fetched successfully'));
});

const registerClub: RequestHandler = asyncHandler(async (req, res) => {
    const clubDetails: ClubInput = req.body;

    clubSchema.parse(clubDetails);

    const createdClub = await createClub(clubDetails, req.user!.id);

    if (!createdClub) throw new ApiError(500, 'Cannot create club');

    return res
        .status(201)
        .json(new ApiResponse(201, createdClub, 'Created club successfully'));
});

const updateClub: RequestHandler = asyncHandler(async (req, res) => {
    const clubDetails: ClubInput = req.body;

    const clubId = parseInt(req.params.id as string);

    if (!clubId) throw new ApiError(400, 'Invalid request');

    // enforce admin rules

    // temp -> check role on DB

    const userRole = await prisma.membership.findFirst({
        where: {
            club_id: clubId,
            user_id: req.user!.id
        }
    });

    if (!userRole) throw new ApiError(401, 'Unauthorized, not a member');

    if (userRole.role != 'ADMIN') {
        throw new ApiError(401, 'Unauthorised, not an Admin');
    }

    const updatedClub = updateClubDetails(clubDetails, clubId);

    if (!updatedClub) throw new ApiError(500, 'Internal server error');

    return res.status;
});

export { getAllClubs, getClubDetails, registerClub, updateClub };
