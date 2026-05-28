import { NextFunction, RequestHandler, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

import { UserRole } from '../types/roles.types';
import { prisma } from "../utils/prisma";

export const authorizeClubRole: RequestHandler = asyncHandler(async (req, res: Response, next: NextFunction) => {

            const clubId = parseInt(req.params?.clubId as string);
            const userId = req.user?.id;

            if (!clubId) {
                return res.status(400).json({ message: 'Club ID is required for authorization.' });
            }

            if (!userId) {
                return res.status(401).json({ message: 'User unauthenticated.' });
            }

            const membership = await prisma.membership.findFirst({
                where:{
                    user_id: userId,
                    club_id: clubId
                },
                select:{
                    role: true,
                }
            });

            let userRoleInClub;
            
            if (!membership) {
                userRoleInClub = UserRole.VISITOR;
            }
            else if(membership.role === "ADMIN" || membership.role === "PRESIDENT" || membership.role === "VICE_PRESIDENT")
                userRoleInClub = UserRole.ADMIN;
            else if(membership.role === "COORDINATOR" || membership.role === "MEMBER")
                userRoleInClub = UserRole.MEMBER;

            const roleHierarchy = {
                [UserRole.ADMIN]: 3,
                [UserRole.MEMBER]: 2,
                [UserRole.VISITOR]: 1
            };

            if(!userRoleInClub) throw new ApiError(500, "Internal Server Error");

            req.role = userRoleInClub;

            next();
        
    })
