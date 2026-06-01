import { QuestionType } from "@prisma/client";
import { UserRole } from "../types/roles.types";
import { ApiError } from "../utils/ApiError";
import {prisma} from "../utils/prisma";

type formParams = {
    role: UserRole,
    inductionId:number
    title: string,
    description?: string | undefined | null,
}

type questionParams = {
    formId: number,
    question_type: QuestionType, 
    question_text: string, 
    order_index: number, 
    is_required?: boolean | undefined,
    metadata?: any
}

const createFormService = async (params: formParams) => {
    const {role, inductionId, title, description} = params;
    if(role === UserRole.VISITOR || role === UserRole.MEMBER) throw new ApiError(403, "Unauthorised");

    const induction = await prisma.induction.findUnique({
        where:{
            id: inductionId,
        }
    });

    if(!induction) throw new ApiError(404, "Induction not found");


    const createdForm = await prisma.form.create({
        data:{
            induction_id: inductionId,
            title,
            description: description? description:null,
            isPublished: false,
        }
    });

    return createdForm;
}

const createQuestionService = async(params: questionParams) => {
    const {formId,
        is_required,
    ...questionData } = params;

    const form = await prisma.form.findFirst({
        where:{
            id: formId,
        }
    })

    if(!form) throw new ApiError(404, "Form not found");

    const createdQuestion = await prisma.formQuestion.create({
        data:{
            ...questionData,
            is_required: is_required? is_required:false,
            form_id: formId
        }
    });

    return createdQuestion;
}

export {createFormService, createQuestionService};