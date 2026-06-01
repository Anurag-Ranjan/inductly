import { Router } from "express";
import { createForm } from "../controllers/form.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeClubRole } from "../middlewares/role.middleware";

const formRouter = Router();

formRouter.route("/").post(authMiddleware, authorizeClubRole, createForm);
formRouter.route("/:formId").post(authMiddleware, authorizeClubRole, createForm);

export {formRouter};