import { RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { fetchAllClubs } from '../services/club.service';

const getAllClubs: RequestHandler = asyncHandler(async (req, res) => {
    if (!req.user) throw new ApiError(401, 'Unauthorised access');

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await fetchAllClubs(page, limit);

    return res
        .status(200)
        .json(new ApiResponse(200, data, 'Clubs fetched successfully'));
});

export { getAllClubs };
