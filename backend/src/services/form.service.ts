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
    userId: number;
    formId: number;
    applicationId: number;
    answers: Array<{ question_id: number; answer: string }>;
};

type saveDraftParams = {
    userId: number;
    formId: number;
    answers: Array<{ question_id: number; answer: any }>;
};

type submitApplicationParams = {
    userId: number;
    formId: number;
    inductionId: number;
    answers: Array<{ question_id: number; answer: any }>;
};

type updateFormParams = {
    formId: number;
    clubId: number;
    title?: string | undefined;
    description?: string | null | undefined;
};

type updateQuestionParams = {
    questionId: number;
    formId: number;
    question_text?: string | undefined;
    question_type?: QuestionType | undefined;
    order_index?: number | undefined;
    is_required?: boolean | undefined;
    metadata?: any;
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

const createQuestionsService = async (
    formId: number,
    questions: Omit<questionParams, 'formId'>[]
) => {
    const form = await prisma.form.findUnique({
        where: { id: formId }
    });

    if (!form) throw new ApiError(404, 'Form not found');

    const createdQuestions = await prisma.$transaction(
        questions.map((q) =>
            prisma.formQuestion.create({
                data: {
                    form_id: formId,
                    question_text: q.question_text,
                    question_type: q.question_type,
                    order_index: q.order_index,
                    is_required: q.is_required ?? false,
                    metadata: q.metadata ?? undefined
                }
            })
        )
    );

    return createdQuestions;
};

const submitFormService = async (params: answerParams) => {
    const { answers, formId, applicationId } = params;
    const form = await prisma.form.findUnique({ where: { id: formId } });

    if (!form) throw new ApiError(404, 'Form not found');

    let response: FormResponse;

    try {
        response = await prisma.formResponse.create({
            data: {
                form_id: form.id,
                user_id: params.userId,

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

const saveFormDraftService = async (params: saveDraftParams) => {
    const { answers, formId, userId } = params;
    const form = await prisma.form.findUnique({ where: { id: formId } });

    if (!form) throw new ApiError(404, 'Form not found');

    const existingResponse = await prisma.formResponse.findUnique({
        where: {
            form_id_user_id: { form_id: formId, user_id: userId }
        },
        include: { answers: true }
    });

    if (existingResponse) {
        await prisma.formAnswer.deleteMany({
            where: { response_id: existingResponse.id }
        });

        const updatedResponse = await prisma.formResponse.update({
            where: { id: existingResponse.id },
            data: {
                answers: {
                    create: answers.map((a) => ({
                        question_id: a.question_id,
                        answer: a.answer
                    }))
                }
            },
            include: { answers: true }
        });

        return updatedResponse;
    }

    const newResponse = await prisma.formResponse.create({
        data: {
            form_id: formId,
            user_id: userId,
            answers: {
                create: answers.map((a) => ({
                    question_id: a.question_id,
                    answer: a.answer
                }))
            }
        },
        include: { answers: true }
    });

    return newResponse;
};

const submitApplicationService = async (params: submitApplicationParams) => {
    const { answers, formId, userId, inductionId } = params;
    const form = await prisma.form.findUnique({ where: { id: formId } });

    if (!form) throw new ApiError(404, 'Form not found');

    const existingResponse = await prisma.formResponse.findUnique({
        where: {
            form_id_user_id: { form_id: formId, user_id: userId }
        },
        include: { answers: true }
    });

    if (
        existingResponse !== null &&
        existingResponse?.application_id !== null
    ) {
        throw new ApiError(409, 'Application has already been submitted');
    }

    const induction = await prisma.induction.findUnique({
        where: {
            id: inductionId,
            NOT: {
                opened_on: null,
                closing_on: null
            }
        },
        select: {
            stages: {
                orderBy: {
                    order_index: 'asc'
                },
                select: {
                    id: true
                }
            }
        }
    });

    if (!induction)
        throw new ApiError(404, 'Induction not found or not published');

    const firstStage = induction.stages[0];
    if (!firstStage) throw new ApiError(400, 'No stages added');

    const application = await prisma.application.upsert({
        where: {
            user_id_induction_id: {
                user_id: userId,
                induction_id: inductionId
            }
        },
        update: {},
        create: {
            user_id: userId,
            induction_id: inductionId,
            current_stage_id: firstStage.id
        }
    });

    const applicationStageProgress =
        await prisma.applicationStageProgress.create({
            data: {
                application_id: application.id,
                stage_id: firstStage.id
            }
        });

    if (existingResponse) {
        if (existingResponse.application_id !== null) {
            throw new ApiError(409, 'Application has already been submitted');
        }

        await prisma.formAnswer.deleteMany({
            where: { response_id: existingResponse.id }
        });

        const updatedResponse = await prisma.formResponse.update({
            where: { id: existingResponse.id },
            data: {
                application_id: application.id,
                answers: {
                    create: answers.map((a) => ({
                        question_id: a.question_id,
                        answer: a.answer
                    }))
                }
            },
            include: { answers: true }
        });

        return updatedResponse;
    }

    const newResponse = await prisma.formResponse.create({
        data: {
            form_id: formId,
            user_id: userId,
            application_id: application.id,
            answers: {
                create: answers.map((a) => ({
                    question_id: a.question_id,
                    answer: a.answer
                }))
            }
        },
        include: { answers: true }
    });

    return newResponse;
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

const updateFormService = async (params: updateFormParams) => {
    const { formId, clubId, title, description } = params;

    const form = await prisma.form.findUnique({
        where: { id: formId },
        include: { induction: { select: { club_id: true } } }
    });

    if (!form) throw new ApiError(404, 'Form not found');
    if (form.induction.club_id !== clubId)
        throw new ApiError(403, 'Unauthorised');

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const updatedForm = await prisma.form.update({
        where: { id: formId },
        data: updateData
    });

    return updatedForm;
};

const updateQuestionService = async (params: updateQuestionParams) => {
    const { questionId, formId, ...data } = params;

    const question = await prisma.formQuestion.findFirst({
        where: { id: questionId, form_id: formId }
    });

    if (!question) throw new ApiError(404, 'Question not found');

    const updateData: Record<string, any> = {};
    if (data.question_text !== undefined)
        updateData.question_text = data.question_text;
    if (data.question_type !== undefined)
        updateData.question_type = data.question_type;
    if (data.order_index !== undefined)
        updateData.order_index = data.order_index;
    if (data.is_required !== undefined)
        updateData.is_required = data.is_required;
    if (data.metadata !== undefined) updateData.metadata = data.metadata;

    const updatedQuestion = await prisma.formQuestion.update({
        where: { id: questionId },
        data: updateData
    });

    return updatedQuestion;
};

const deleteQuestionService = async (questionId: number, formId: number) => {
    const question = await prisma.formQuestion.findFirst({
        where: { id: questionId, form_id: formId }
    });

    if (!question) throw new ApiError(404, 'Question not found');

    await prisma.formQuestion.delete({
        where: { id: questionId }
    });

    return question;
};

// const getFormResponseService = async (formId:number, applicationId: number, inductionId: number) => {
//     const response = await prisma.formResponse.findUnique();
// }

const getFormByInductionService = async (inductionId: number) => {
    const form = await prisma.form.findFirst({
        where: { induction_id: inductionId },
        include: {
            questions: {
                orderBy: { order_index: 'asc' }
            }
        }
    });

    return form;
};

const getFormForApplicantService = async (formId: number, userId: number) => {
    const form = await prisma.form.findUnique({
        where: { id: formId },
        include: {
            responses: {
                where: {
                    user_id: userId
                },
                select: {
                    answers: true,
                    application_id: true
                }
            },
            questions: {
                orderBy: { order_index: 'asc' },
                select: {
                    id: true,
                    question_text: true,
                    question_type: true,
                    is_required: true,
                    order_index: true,
                    metadata: true
                }
            },
            induction: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    club: {
                        select: {
                            id: true,
                            name: true,
                            logo: true
                        }
                    }
                }
            }
        }
    });

    return form;
};

export {
    createFormService,
    createQuestionService,
    createQuestionsService,
    submitFormService,
    saveFormDraftService,
    submitApplicationService,
    publishFormService,
    getFormInformationService,
    getFormByInductionService,
    updateFormService,
    updateQuestionService,
    deleteQuestionService,
    getFormForApplicantService
};
