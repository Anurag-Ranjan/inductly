import { Router } from 'express';
import {
    createInduction,
    getInductionDetails,
    getInductions,
    publishInduction
} from '../controllers/induction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeClubRole } from '../middlewares/role.middleware';

export const inductionRouter = Router();

inductionRouter.route('/').get(authMiddleware, getInductions);
inductionRouter.route('/:id').get(authMiddleware, getInductionDetails);
inductionRouter.route('/').post(authMiddleware, authorizeClubRole, createInduction);
inductionRouter.route('/:id').patch(authMiddleware, authorizeClubRole ,publishInduction);
