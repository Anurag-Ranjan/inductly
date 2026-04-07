import { Router } from 'express';
import {
    getAllClubs,
    getClubDetails,
    registerClub,
    updateClub
} from '../controllers/club.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const clubRouter = Router();

clubRouter.route('/').get(authMiddleware, getAllClubs);
clubRouter.route('/:id').get(authMiddleware, getClubDetails);
clubRouter.route('/').post(authMiddleware, registerClub);
clubRouter.route('/:id').patch(authMiddleware, updateClub);
