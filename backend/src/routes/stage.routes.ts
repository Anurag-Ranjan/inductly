import { Router } from "express";
import { createInductionStage, getAllStages, updateInductionStage } from "../controllers/stage.controller";

export const stageRouter = Router();

stageRouter.get("/", getAllStages);
stageRouter.post("/", createInductionStage);
stageRouter.patch("/:stageId", updateInductionStage);