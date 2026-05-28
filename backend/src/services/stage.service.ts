import {prisma} from "../utils/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { UserRole } from "../types/roles.types";

type CreateStagePayload = {
    inductionId: number;
    role: UserRole,
    userId: number;
    payload: {
        name: string;
        description?: string|null|undefined;
    };
};

const fetchInductionStages = async(inductionId: number) => {
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
        where:{
            induction_id: induction.id,
        },
        orderBy:{
            order_index: 'asc',
        },
        select:{
            id: true,
            name:true,
            description:true,
            order_index: true,
            created_at: true,
            updated_at: true,
        }
    })

    return inductionStages;

};

const createStage = async({
    inductionId,
    role,
    userId,
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
        throw new ApiError(404, "Induction not found");
    }

    if(role == UserRole.MEMBER || role == UserRole.VISITOR){
        throw new ApiError(403, "Forbidden");
    }

    const lastStage = await prisma.inductionStage.findFirst({
        where: {
            induction_id: inductionId
        },
        orderBy: {
            order_index: "desc"
        },
        select: {
            order_index: true
        }
    });

    const nextOrder =
        lastStage?.order_index
            ? lastStage.order_index + 1
            : 1;

    if (payload.description === undefined) payload.description = null;

    const stage = await prisma.inductionStage.create({
        data: {
            induction_id: inductionId,
            name: payload.name,
            description: payload.description,
            order_index: nextOrder
        }
    });

    return stage;

}

export {fetchInductionStages, createStage};