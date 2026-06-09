import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { RequestHandler, Response } from 'express';
import { UserRole } from '../types/roles.types';
import {
    createStage,
    fetchInductionStages,
    updateStage
} from '../services/stage.service';
import {
    createStageSchema,
    updateStageSchema
} from '../validations/stage.validation';

const getAllStages: RequestHandler = asyncHandler(
    async (req, res: Response) => {
        const inductionId = Number(req.params.inductionId);
        const role = req.role;
        const user = req.user;

        if (!user) throw new ApiError(401, 'Unauthenticated');

        if (!role) throw new ApiError(403, 'Unauthorised');

        if (!inductionId || isNaN(inductionId))
            throw new ApiError(400, 'Invalid induction id provided');

        const stages = await fetchInductionStages(inductionId);

        if (!stages) throw new ApiError(500, 'Internal Server Error');

        return res
            .status(200)
            .json(new ApiResponse(200, stages, 'Stages fetched successfully'));
    }
);

const createInductionStage: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');

    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorised');

    const clubId = Number(req.params.clubId);

    if (!clubId || isNaN(clubId)) throw new ApiError(400, 'Invalid club id');

    const inductionId = Number(req.params.inductionId);

    if (!inductionId || isNaN(inductionId)) {
        throw new ApiError(400, 'Invalid induction id');
    }

    const parsedData = req.body.map((stage: any) =>
        createStageSchema.parse(stage)
    );

    const createdStages = await Promise.all(
        parsedData.map(
            async (data: {
                name: string;
                description?: null | undefined | string;
                order_index: number;
            }) =>
                await createStage({
                    clubId,
                    inductionId,
                    role,
                    userId: user.id,
                    payload: data
                })
        )
    );

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdStages, 'Stage created successfully')
        );
});

const updateInductionStage: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, 'Unauthenticated');
    }

    const role = req.role;

    if (!role) {
        throw new ApiError(403, 'Unauthorized');
    }

    const inductionId = Number(req.params.inductionId);
    const stageId = Number(req.params.stageId);

    if (!inductionId || isNaN(inductionId)) {
        throw new ApiError(400, 'Invalid induction id');
    }

    if (!stageId || isNaN(stageId)) {
        throw new ApiError(400, 'Invalid stage id');
    }

    const parsedData = updateStageSchema.parse(req.body);

    const updatedStage = await updateStage({
        inductionId,
        stageId,
        role,
        payload: parsedData
    });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedStage, 'Stage updated successfully'));
});

export { getAllStages, createInductionStage, updateInductionStage };
