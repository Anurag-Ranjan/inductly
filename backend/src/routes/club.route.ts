import { Router } from 'express';
import {
    getMyClubs,
    getClubDashboard,
    getClubDetails,
    registerClub,
    updateClub,
    getAllClubs
} from '../controllers/club.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeClubRole } from '../middlewares/role.middleware';

export const clubRouter = Router();

clubRouter.route('/').get(authMiddleware, getMyClubs);
clubRouter.route('/all').get(authMiddleware, getAllClubs);
clubRouter
    .route('/:clubId')
    .get(authMiddleware, authorizeClubRole, getClubDetails);
clubRouter
    .route('/:clubId/dashboard')
    .get(authMiddleware, authorizeClubRole, getClubDashboard);
clubRouter.route('/').post(authMiddleware, registerClub);
clubRouter.route('/:id').patch(authMiddleware, updateClub);
