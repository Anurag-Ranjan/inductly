import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../utils/prisma';
import { RequestHandler } from 'express';
import {
    fetchInductionDetails,
    fetchInductions,
    updateInductionDates
} from '../services/induction.service';
import {
    createInductionSchema,
    updateInductionSchema
} from '../validations/induction.validation';
import { MemberRole } from '@prisma/client';
import { UserRole } from '../types/roles.types';

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

// getInduction details for an applicant should also return the president of the club and email of admins

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
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthorised');

    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorised');

    const clubId = parseInt(req.params.clubId as string);

    const isAdmin = role === UserRole.ADMIN;

    if (!isAdmin) throw new ApiError(403, 'Forbidden');

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
                'Induction registered successfully'
            )
        );
});

const publishInduction: RequestHandler = asyncHandler(async (req, res) => {
    //admin check
    // check if previous steps are done, i.e. stages done, form done
    const user = req.user;

    if (!user) throw new ApiError(401, 'Unauthorised');

    const clubId = parseInt(req.params.clubId as string);

    const inductionId = parseInt(req.params.id as string);

    if (!clubId || !inductionId) throw new ApiError(400, 'Missing Fields');

    const role = await prisma.membership.findUnique({
        where: {
            user_id_club_id: {
                user_id: user?.id,
                club_id: clubId
            }
        }
    });

    if (!role || role?.role != 'ADMIN') throw new ApiError(403, 'Forbidden');

    const { opened_on, closing_on } = updateInductionSchema.parse(req.body);

    if (!opened_on || !closing_on) throw new ApiError(400, 'Missing fields');

    const publishedInduction = await updateInductionDates(
        inductionId,
        opened_on,
        closing_on
    );

    if (!publishedInduction) throw new ApiError(500, 'Internal Server Error');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                publishedInduction,
                'Induction published successfully'
            )
        );
});

export {
    getInductions,
    getInductionDetails,
    createInduction,
    publishInduction
};
