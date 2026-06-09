import { Router } from "express";
import { createInductionStage, getAllStages, updateInductionStage } from "../controllers/stage.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeClubRole } from "../middlewares/role.middleware";

export const stageRouter = Router({ mergeParams: true });

stageRouter.get("/",authMiddleware, authorizeClubRole, getAllStages);
stageRouter.post("/",authMiddleware, authorizeClubRole, createInductionStage);
stageRouter.patch("/:stageId",authMiddleware, authorizeClubRole, updateInductionStage);