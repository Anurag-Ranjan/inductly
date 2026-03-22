import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../utils/prisma';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        name: string;
    };
}

export const authMiddleware = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { accessToken } = req.cookies;

        if (!accessToken) throw new ApiError(401, 'Unauthoried acceess');

        try {
            const decoded = jwt.verify(
                accessToken,
                process.env.JWT_SECRET!
            ) as {
                userId: number;
            };

            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.userId
                },
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            });

            if (!user) throw new ApiError(401, 'Invalid Token Provided');

            req.user = user;

            return next();
        } catch (error) {
            throw new ApiError(401, 'Invalid or Expired token');
        }
    }
);
