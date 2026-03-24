import { Router } from 'express';
import {
    loginUser,
    logoutUser,
    registerUser,
    verifyUser
} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const userRouter = Router();

userRouter.route('/signup').post(registerUser);
userRouter.route('/verify/:token').get(verifyUser);
userRouter.route('login').post(loginUser);
userRouter.route('/logout').get(authMiddleware, logoutUser);
