import { Prisma, QuestionType, FormResponse } from '@prisma/client';
import { UserRole } from '../types/roles.types';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../utils/prisma';

type formParams = {
    role: UserRole;
    inductionId: number;
    title: string;
    description?: string | undefined | null;
};

type questionParams = {
    formId: number;
    question_type: QuestionType;
    question_text: string;
    order_index: number;
    is_required?: boolean | undefined;
    metadata?: any;
};

type answerParams = {
    formId: number;
    applicationId: number;
    answers: Array<{ question_id: number; answer: string }>;
};

const createFormService = async (params: formParams) => {
    const { role, inductionId, title, description } = params;
    if (role === UserRole.VISITOR || role === UserRole.MEMBER)
        throw new ApiError(403, 'Unauthorised');

    const induction = await prisma.induction.findUnique({
        where: {
            id: inductionId
        }
    });

    if (!induction) throw new ApiError(404, 'Induction not found');

    const createdForm = await prisma.form.create({
        data: {
            induction_id: inductionId,
            title,
            description: description ? description : null,
            isPublished: false
        }
    });

    return createdForm;
};

const createQuestionService = async (params: questionParams) => {
    const { formId, is_required, ...questionData } = params;

    const form = await prisma.form.findFirst({
        where: {
            id: formId
        }
    });

    if (!form) throw new ApiError(404, 'Form not found');

    const createdQuestion = await prisma.formQuestion.create({
        data: {
            ...questionData,
            is_required: is_required ? is_required : false,
            form_id: formId
        }
    });

    return createdQuestion;
};

const submitFormService = async (params: answerParams) => {
    const { answers, formId, applicationId } = params;
    const [form, application] = await Promise.all([
        prisma.form.findUnique({ where: { id: formId } }),
        prisma.application.findUnique({ where: { id: applicationId } })
    ]);

    if (!form || !application)
        throw new ApiError(404, 'Form or application not found');

    let response: FormResponse;

    try {
        response = await prisma.formResponse.create({
            data: {
                form_id: form.id,
                application_id: application.id,
                answers: {
                    create: answers
                }
            }
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            throw new ApiError(409, 'Form has already been submitted');
        }

        throw error;
    }

    return response;
};

const publishFormService = async (formId: number, clubId: number) => {
    const form = await prisma.form.findUnique({
        where: { id: formId },
        include: { questions: true }
    });

    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    if (form.questions.length === 0)
        throw new ApiError(400, 'Cannot publish an enpty form');

    if (form.isPublished) {
        throw new ApiError(400, 'Form already published');
    }

    const induction = await prisma.induction.findUnique({
        where: {
            id: form.induction_id
        }
    });

    if (!induction) throw new ApiError(404, 'Induction not found');

    if (induction.club_id !== clubId) throw new ApiError(403, 'Unauthorised');

    const publishedInduction = await prisma.form.update({
        where: {
            id: form.id
        },
        data: {
            isPublished: true
        }
    });

    return publishedInduction;
};

const getFormInformationService = async (formId: number, clubId: number) => {
    const form = await prisma.form.findUnique({
        where: {
            id: formId
        },
        include: {
            questions: {
                orderBy: {
                    order_index: 'asc'
                }
            }
        }
    });

    if (!form) throw new ApiError(404, 'Form not found');
    return form;
};

// const getFormResponseService = async (formId:number, applicationId: number, inductionId: number) => {
//     const response = await prisma.formResponse.findUnique();
// }

export {
    createFormService,
    createQuestionService,
    submitFormService,
    publishFormService,
    getFormInformationService
};
