import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { RequestHandler, Response } from "express";
import { UserRole } from "../types/roles.types";
import { createStage, fetchInductionStages } from "../services/stage.service";
import { createStageSchema } from "../validations/stage.validation";

const getAllStages: RequestHandler = asyncHandler(async (req, res: Response ) => {
    const inductionId = Number(req.params.inductionId);
    const role = req.role;
    const user = req.user;

    if(!user) throw new ApiError(401, "Unauthenticated");

    if(!role) throw new ApiError(403, "Unauthorised");

    if(!inductionId || isNaN(inductionId)) throw new ApiError(400, "Invalid induction id provided");

    const stages = await fetchInductionStages(inductionId);

    if(!stages) throw new ApiError(500, "Internal Server Error");

    return res.status(200).json(new ApiResponse(200, stages, "Stgaes fetched successfully"));
});

const createInductionStage: RequestHandler = asyncHandler(async(req, res) => {
    const user = req.user;
    if(!user) throw new ApiError(401, "Unauthenticated");

    const role = req.role;
    if(!role) throw new ApiError(403, "Unauthorised")
    
    const inductionId = Number(req.params.inductionId);
    
    if (!inductionId || isNaN(inductionId)) {
        throw new ApiError(400, "Invalid induction id");
    }

    const parsedData = createStageSchema.parse(req.body);

    const createdStage = await createStage({
        inductionId,
        role,
        userId: user.id,
        payload: parsedData
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            createdStage,
            "Stage created successfully"
        )
    );

});

export {getAllStages, createInductionStage};