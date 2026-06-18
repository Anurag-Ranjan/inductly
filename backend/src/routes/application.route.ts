import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
    getApplicationDetails,
    getMyApplications,
    moveApplicationToNextStage,
    scoreApplicant
} from '../controllers/application.controller';
import { authorizeClubRole } from '../middlewares/role.middleware';

export const applicationRouter = Router({ mergeParams: true });

applicationRouter.route('/me').get(authMiddleware, getMyApplications);
applicationRouter
    .route('/:applicationId/details')
    .get(authMiddleware, getApplicationDetails);
applicationRouter
    .route('/:applicationId/stages/:stageId')
    .patch(authMiddleware, authorizeClubRole, scoreApplicant);
applicationRouter
    .route('/:applicationId/stages/:stageId/next-stage')
    .patch(authMiddleware, authorizeClubRole, moveApplicationToNextStage);
