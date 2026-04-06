import { Router } from 'express';
import { getAllClubs } from '../controllers/club.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const clubRouter = Router();

clubRouter.route('/').get(authMiddleware, getAllClubs);
