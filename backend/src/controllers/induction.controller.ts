import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../utils/prisma';
import { RequestHandler } from 'express';
import {
    fetchInductionDetails,
    fetchInductions
} from '../services/induction.service';
import { createInductionSchema } from '../validations/induction.validation';

const getInductions: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) throw new ApiError(401, 'Unauthorised');

    const clubId = parseInt(req.params.clubId as string);

    if (!clubId) throw new ApiError(400, 'Missing clubId');

    const inductionInformation = await fetchInductions(clubId, user.id);

    if (!inductionInformation) throw new ApiError(500, 'Internal Server error');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                inductionInformation,
                'Inductions fetched successfully'
            )
        );
});

const getInductionDetails: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) throw new ApiError(401, 'Unauthorised');

    const inductionId = parseInt(req.params.id as string);
    const clubId = parseInt(req.params.clubId as string);

    if (!inductionId) throw new ApiError(400, 'Missing id field');

    const inductions = await fetchInductionDetails(
        inductionId,
        user.id,
        clubId
    );

    if (!inductions) throw new ApiError(500, 'Could not get inductions');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                inductions,
                'Induction details fetched successfully'
            )
        );
});

const createInduction: RequestHandler = asyncHandler(async (req, res) => {
    // enforce admin rules, role check for temporary access

    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthorised');

    const clubId = parseInt(req.params.clubId as string);

    const isAdmin = await prisma.membership.findUnique({
        where: {
            user_id_club_id: {
                user_id: user.id,
                club_id: clubId
            }
        },
        select: {
            role: true
        }
    });

    if (!isAdmin || !['PRESIDENT', 'ADMIN'].includes(isAdmin.role))
        throw new ApiError(403, 'Forbidden');

    const parsedData = createInductionSchema.parse(req.body);

    const createdInduction = await prisma.induction.create({
        data: {
            title: parsedData.title,
            description: parsedData.description ?? null,
            club_id: clubId
        },
        select: {
            id: true
        }
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createdInduction,
                'Induction registered successfuly'
            )
        );
});

// getInduction details for an applicant should also return the president of the club and email of admins

export { getInductions, getInductionDetails, createInduction };
