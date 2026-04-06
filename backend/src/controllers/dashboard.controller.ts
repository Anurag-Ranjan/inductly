import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { RequestHandler } from 'express';
import { fetchDashboard } from '../services/dashboard.service';

const getUserDashboard: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) throw new ApiError(401, 'Unauthorised access');

    const data = await fetchDashboard(user.id);

    if (!data) throw new ApiError(500, 'Internal server error');

    return res
        .status(200)
        .json(new ApiResponse(200, data, 'Dashboard fetched successfully'));
});

export { getUserDashboard };
