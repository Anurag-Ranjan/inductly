import { Router } from 'express';
import {
    getAllClubs,
    getClubDetails,
    registerClub,
    updateClub
} from '../controllers/club.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeClubRole } from '../middlewares/role.middleware';

export const clubRouter = Router();

clubRouter.route('/').get(authMiddleware, getAllClubs);
clubRouter
    .route('/:clubId')
    .get(authMiddleware, authorizeClubRole, getClubDetails);
clubRouter.route('/').post(authMiddleware, registerClub);
clubRouter.route('/:id').patch(authMiddleware, updateClub);
