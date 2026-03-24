import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../utils/prisma';
import jwt from 'jsonwebtoken';
import { tokenPayload } from '../types/jwt.types';

export const authMiddleware = asyncHandler(
    async (req, res: Response, next: NextFunction) => {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) throw new ApiError(401, 'Unauthorized acceess');

        try {
            const decoded: tokenPayload = jwt.verify(
                accessToken,
                process.env.JWT_SECRET!
            ) as tokenPayload;

            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.id
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
