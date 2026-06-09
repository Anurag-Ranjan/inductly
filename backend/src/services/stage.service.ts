import { prisma } from '../utils/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../types/roles.types';

type CreateStagePayload = {
    clubId: number;
    inductionId: number;
    role: UserRole;
    userId: number;
    payload: {
        name: string;
        description?: string | null | undefined;
        order_index: number;
    };
};

type UpdateStagePayload = {
    inductionId: number;
    stageId: number;
    role: UserRole;
    payload: {
        name: string;
        description?: string | null | undefined;
    };
};

const fetchInductionStages = async (inductionId: number) => {
    const induction = await prisma.induction.findUnique({
        where: {
            id: inductionId
        },
        select: {
            id: true,
            title: true
        }
    });

    if (!induction) {
        throw new ApiError(404, 'Induction not found');
    }

    const inductionStages = await prisma.inductionStage.findMany({
        where: {
            induction_id: induction.id
        },
        orderBy: {
            order_index: 'asc'
        },
        select: {
            id: true,
            name: true,
            description: true,
            order_index: true,
            created_at: true,
            updated_at: true
        }
    });

    return inductionStages;
};

const createStage = async ({
    clubId,
    inductionId,
    role,
    payload
}: CreateStagePayload) => {
    const induction = await prisma.induction.findUnique({
        where: {
            id: inductionId
        },
        select: {
            id: true,
            club_id: true
        }
    });

    if (!induction) {
        throw new ApiError(404, 'Induction not found');
    }

    if (induction.club_id !== clubId)
        throw new ApiError(
            403,
            'Unauthorised, Only members of this club can add stages'
        );

    if (role == UserRole.MEMBER || role == UserRole.VISITOR) {
        throw new ApiError(403, 'Forbidden');
    }

    const stage = await prisma.inductionStage.create({
        data: {
            induction_id: inductionId,
            name: payload.name,
            description: !payload.description ? null : payload.description,
            order_index: payload.order_index
        }
    });

    return stage;
};

const updateStage = async ({
    inductionId,
    stageId,
    role,
    payload
}: UpdateStagePayload) => {
    const allowedRoles = [UserRole.ADMIN];

    if (!allowedRoles.includes(role)) {
        throw new ApiError(403, 'Forbidden');
    }

    const existingStage = await prisma.inductionStage.findFirst({
        where: {
            id: stageId,
            induction_id: inductionId
        }
    });

    if (!existingStage) {
        throw new ApiError(404, 'Stage not found for this induction');
    }

    if (payload.description === undefined) payload.description = null;

    const updatedStage = await prisma.inductionStage.update({
        where: {
            id: stageId
        },
        data: {
            name: payload.name,
            description: payload.description,
            updated_at: Date()
        }
    });

    return updatedStage;
};

export { fetchInductionStages, createStage, updateStage };
