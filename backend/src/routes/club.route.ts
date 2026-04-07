import { Router } from 'express';
import { getAllClubs, getClubDetails } from '../controllers/club.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const clubRouter = Router();

clubRouter.route('/').get(authMiddleware, getAllClubs);
clubRouter.route('/:id').get(authMiddleware, getClubDetails);
