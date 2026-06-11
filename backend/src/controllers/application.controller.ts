import { RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { getMyApplicationsService } from '../services/application.service';

const getMyApplications: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');

    const applications = await getMyApplicationsService({ userId: user.id });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                applications,
                'Applictions fetched successfully'
            )
        );
});

const getApplicationDetail: RequestHandler = asyncHandler(
    async (req, res) => {}
);

const getApplicationsForAnInduction: RequestHandler = asyncHandler(
    async (req, res) => {}
);

export { getMyApplications };
