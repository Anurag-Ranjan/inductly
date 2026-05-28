import { Router } from "express";
import { createInductionStage, getAllStages } from "../controllers/stage.controller";

export const stageRouter = Router();

stageRouter.get("/", getAllStages);
stageRouter.post("/", createInductionStage);