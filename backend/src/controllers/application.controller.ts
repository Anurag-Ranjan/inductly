import { application, RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import {
    getApplicationDetailsService,
    getMyApplicationsService,
    moveApplicationToNextStageService,
    scoreApplicantService
} from '../services/application.service';
import { UserRole } from '../types/roles.types';

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

    const applicationDetails =
        await getApplicationDetailsService(applicationId);

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

const scoreApplicant: RequestHandler = asyncHandler(async (req, res) => {
    const role = req.role;

    if (role !== UserRole.ADMIN) throw new ApiError(403, 'Unauthorised');

    const applicationId = Number(req.params.applicationId);
    if (!applicationId || isNaN(applicationId))
        throw new ApiError(401, 'Invalid club id');

    const clubId = Number(req.query.clubId);
    if (!clubId || isNaN(clubId)) throw new ApiError(401, 'Invalid club id');

    const stageId = Number(req.params.stageId);
    if (!stageId || isNaN(stageId)) throw new ApiError(401, 'Invalid stage id');

    const response = await scoreApplicantService(
        applicationId,
        clubId,
        stageId,
        req.body
    );

    return res
        .status(201)
        .json(new ApiResponse(201, response, 'Applicant scored'));
});

const moveApplicationToNextStage: RequestHandler = asyncHandler(
    async (req, res) => {
        const role = req.role;

        if (role !== UserRole.ADMIN) throw new ApiError(403, 'Unauthorised');

        const applicationId = Number(req.params.applicationId);
        if (!applicationId || isNaN(applicationId))
            throw new ApiError(401, 'Invalid application id');

        const clubId = Number(req.query.clubId);
        if (!clubId || isNaN(clubId))
            throw new ApiError(401, 'Invalid club id');

        const stageId = Number(req.params.stageId);
        if (!stageId || isNaN(stageId))
            throw new ApiError(401, 'Invalid stage id');

        const response = await moveApplicationToNextStageService(
            applicationId,
            clubId,
            stageId
        );

        return res
            .status(201)
            .json(new ApiResponse(201, response, 'Stage updated successfully'));
    }
);

export {
    getMyApplications,
    getApplicationDetails,
    scoreApplicant,
    moveApplicationToNextStage
};
