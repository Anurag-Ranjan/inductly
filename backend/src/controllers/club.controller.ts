import { RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { fetchAllClubs, fetchClubDetails } from '../services/club.service';

const getAllClubs: RequestHandler = asyncHandler(async (req, res) => {
    if (!req.user) throw new ApiError(401, 'Unauthorised access');

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await fetchAllClubs(page, limit);

    return res
        .status(200)
        .json(new ApiResponse(200, data, 'Clubs fetched successfully'));
});

const getClubDetails: RequestHandler = asyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.id as string);
    const userId = req.user?.id;

    if (!clubId || !userId) throw new ApiError(401, 'Unauthorised Request');

    const club = fetchClubDetails(clubId, userId);

    if (!club) throw new ApiError(404, 'Club not found');

    return res
        .status(200)
        .json(new ApiResponse(200, club, 'Club details fetched successfully'));
});

export { getAllClubs, getClubDetails };
