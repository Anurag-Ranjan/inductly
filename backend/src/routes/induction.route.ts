import { Router } from 'express';
import {
    createInduction,
    getAllOpenInductions,
    getInductionDashboard,
    getInductionDetails,
    getInductions,
    getIsInductionPublished,
    publishInduction,
    updateInductionDetails
} from '../controllers/induction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeClubRole, isAdmin } from '../middlewares/role.middleware';

export const inductionRouter = Router({ mergeParams: true });

inductionRouter.route('/').get(authMiddleware, getInductions);
inductionRouter.route('/open').get(authMiddleware, getAllOpenInductions);
inductionRouter
    .route('/:inductionId')
    .get(authMiddleware, authorizeClubRole, getInductionDetails);
inductionRouter
    .route('/:inductionId/dashboard')
    .get(authMiddleware, authorizeClubRole, getInductionDashboard);
inductionRouter
    .route('/:inductionId/ispublished')
    .get(authMiddleware, authorizeClubRole, getIsInductionPublished);
inductionRouter
    .route('/')
    .post(authMiddleware, authorizeClubRole, createInduction);
inductionRouter
    .route('/:inductionId/update')
    .patch(authMiddleware, authorizeClubRole, isAdmin, updateInductionDetails);
inductionRouter
    .route('/:inductionId')
    .patch(authMiddleware, authorizeClubRole, publishInduction);
