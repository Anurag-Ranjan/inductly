import { Router } from 'express';
import {
    loginUser,
    logoutUser,
    registerUser,
    verifyUser,
    onboardUser,
    updateProfile,
    refreshAccessToken,
    getUserProfile,
    updateGithub,
    updateLinkedIn
} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const userRouter = Router();

userRouter.route('/signup').post(registerUser);
userRouter.route('/verify/:token').get(verifyUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').get(authMiddleware, logoutUser);
userRouter.route('/onboard').post(authMiddleware, onboardUser);
userRouter.route('/profile/update').patch(authMiddleware, updateProfile);
userRouter.route('/profile').get(authMiddleware, getUserProfile);
userRouter.route('/refresh-access-token').get(refreshAccessToken);
userRouter.route('/socials/update/github').patch(authMiddleware, updateGithub);
userRouter
    .route('/socials/update/linkedin')
    .patch(authMiddleware, updateLinkedIn);
