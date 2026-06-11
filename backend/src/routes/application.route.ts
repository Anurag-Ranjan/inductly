import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getMyApplications } from '../controllers/application.controller';

export const applicationRouter = Router({ mergeParams: true });

applicationRouter.route('/me').get(authMiddleware, getMyApplications);
