import { Router } from 'express';
import {
    createInduction,
    getAllOpenInductions,
    getInductionDetails,
    getInductions,
    publishInduction
} from '../controllers/induction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeClubRole } from '../middlewares/role.middleware';

export const inductionRouter = Router({ mergeParams: true });

inductionRouter.route('/').get(authMiddleware, getInductions);
inductionRouter.route('/open').get(authMiddleware, getAllOpenInductions);
inductionRouter.route('/:id').get(authMiddleware, getInductionDetails);
inductionRouter
    .route('/')
    .post(authMiddleware, authorizeClubRole, createInduction);
inductionRouter
    .route('/:id')
    .patch(authMiddleware, authorizeClubRole, publishInduction);
