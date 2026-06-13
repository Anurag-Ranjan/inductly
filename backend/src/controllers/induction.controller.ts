import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../utils/prisma';
import { RequestHandler } from 'express';
import {
    fetchAllOpenInductions,
    fetchInductionDetails,
    fetchInductions,
    updateInductionDates,
    updateInductionDetailsService
} from '../services/induction.service';
import {
    createInductionSchema,
    updateInductionSchema
} from '../validations/induction.validation';
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

const updateInductionDetails: RequestHandler = asyncHandler(
    async (req, res) => {
        const user = req.user;

        if (!user) throw new ApiError(401, 'Unauthenticated');

        const isAdmin = req.isAdmin;
        if (!isAdmin) throw new ApiError(403, 'Umauthorised');

        const inductionId = Number(req.params.inductionId);

        if (!inductionId || isNaN(inductionId))
            throw new ApiError(401, 'Invalid induction id');

        const { title, description } = createInductionSchema.parse(req.body);

        const updatedInduction = await updateInductionDetailsService({
            inductionId,
            title,
            description
        });

        return res
            .status(201)
            .json(
                new ApiResponse(201, updatedInduction, 'Updated successfully')
            );
    }
);

// getInduction details for an applicant should also return the president of the club and email of admins

const getInductionDetails: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) throw new ApiError(401, 'Unauthorised');

    const role = req.role;

    if (!role) throw new ApiError(403, 'Unauthorised');

    const inductionId = Number(req.params.inductionId);
    const clubId = Number(req.params.clubId);

    if (!inductionId || isNaN(inductionId))
        throw new ApiError(400, 'Missing id field');

    const inductions = await fetchInductionDetails(inductionId, role);

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

    const inductionId = Number(req.params.inductionId);

    if (!inductionId || isNaN(inductionId))
        throw new ApiError(400, 'Invalid induction id');

    const role = req.role;

    if (!role || role != UserRole.ADMIN) throw new ApiError(403, 'Forbidden');

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

const getAllOpenInductions: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthorised');

    const page = parseInt(req.query.page as string) || 1;
    const limit = 6;

    const result = await fetchAllOpenInductions(page, limit);

    return res
        .status(200)
        .json(
            new ApiResponse(200, result, 'Open inductions fetched successfully')
        );
});

const getIsInductionPublished: RequestHandler = asyncHandler(
    async (req, res) => {
        const user = req.user;
        if (!user) throw new ApiError(401, 'Unauthenticated');

        const role = req.role;
        if (!role) throw new ApiError(403, 'Unauthorised');

        const inductionId = Number(req.params.inductionId);

        const induction = await prisma.induction.findUnique({
            where: {
                id: inductionId
            },
            select: {
                id: true,
                opened_on: true,
                closing_on: true
            }
        });

        const formattedInduction = {
            ...induction,
            isPublished: induction?.closing_on && induction.opened_on
        };

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    formattedInduction,
                    'Status fetched successfully'
                )
            );
    }
);

export {
    getInductions,
    getInductionDetails,
    createInduction,
    publishInduction,
    getAllOpenInductions,
    getIsInductionPublished,
    updateInductionDetails
};
