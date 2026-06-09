import { NextFunction, RequestHandler, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

import { UserRole } from '../types/roles.types';
import { prisma } from '../utils/prisma';
import { MemberRole } from '@prisma/client';

export const authorizeClubRole: RequestHandler = asyncHandler(
    async (req, res: Response, next: NextFunction) => {
        const clubId = Number(req.params?.clubId);
        const userId = req.user?.id;

        if (!clubId || isNaN(clubId)) {
            return res
                .status(400)
                .json({ message: 'Club ID is required for authorization.' });
        }

        if (!userId) {
            return res.status(401).json({ message: 'User unauthenticated.' });
        }

        const membership = await prisma.membership.findFirst({
            where: {
                user_id: userId,
                club_id: clubId
            },
            select: {
                role: true
            }
        });

        let userRoleInClub;

        if (!membership) {
            userRoleInClub = UserRole.VISITOR;
        } else if (
            membership.role === MemberRole.ADMIN ||
            membership.role === MemberRole.PRESIDENT ||
            membership.role === MemberRole.VICE_PRESIDENT
        )
            userRoleInClub = UserRole.ADMIN;
        else if (
            membership.role === MemberRole.COORDINATOR ||
            membership.role === MemberRole.MEMBER
        )
            userRoleInClub = UserRole.MEMBER;

        const roleHierarchy = {
            [UserRole.ADMIN]: 3,
            [UserRole.MEMBER]: 2,
            [UserRole.VISITOR]: 1
        };

        if (!userRoleInClub) throw new ApiError(500, 'Internal Server Error');

        req.role = userRoleInClub;

        next();
    }
);
