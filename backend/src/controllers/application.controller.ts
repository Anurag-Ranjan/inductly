import { RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import {
    getApplicationDetailsService,
    getMyApplicationsService
} from '../services/application.service';

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

const getApplicationDetails: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');

    const applicationId = Number(req.params.applicationId);
    if (!applicationId || isNaN(applicationId))
        throw new ApiError(401, 'Invalid application id provided');

    const applicationDetails = await getApplicationDetailsService(applicationId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                applicationDetails,
                'Application details fetched successfully'
            )
        );
});

export { getMyApplications, getApplicationDetails };
