import { Router } from 'express';
import {
    loginUser,
    logoutUser,
    registerUser,
    verifyUser,
    onboardUser,
    updateProfile,
    refreshAccessToken,
    getUserProfile
} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const userRouter = Router();

userRouter.route('/signup').post(registerUser);
userRouter.route('/verify/:token').get(verifyUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').get(authMiddleware, logoutUser);
userRouter.route('/onboard').get(authMiddleware, onboardUser);
userRouter.route('/profile/update').get(authMiddleware, updateProfile);
userRouter.route('/profile').get(authMiddleware, getUserProfile);
userRouter
    .route('/refresh-access-token')
    .get(authMiddleware, refreshAccessToken);
