import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../utils/prisma';
import { RequestHandler } from 'express';
import { fetchInductions } from '../services/induction.service';

const getInductions: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) throw new ApiError(401, 'Unauthorised');

    const clubId = parseInt(req.params.club as string);

    if (!clubId) throw new ApiError(400, 'Missing clubId');

    const inductionInformation = await fetchInductions(clubId, user.id);

    if (!inductionInformation) throw new ApiError(500, 'Internal Server error');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                inductionInformation,
                'Inductions fetched successfully'
            )
        );
});

export { getInductions };
