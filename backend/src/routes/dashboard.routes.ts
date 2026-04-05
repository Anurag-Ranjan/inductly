import { Router } from 'express';
import { getUserDashboard } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const dashboardRouter = Router();

dashboardRouter.route('/').get(authMiddleware, getUserDashboard);
