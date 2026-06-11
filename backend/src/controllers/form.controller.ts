import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { RequestHandler, response } from 'express';
import {
    createQuestionSchema,
    createQuestionsSchema,
    formSchema,
    updateFormSchema,
    updateQuestionSchema
} from '../validations/form.validations';
import {
    createFormService,
    createQuestionService,
    createQuestionsService,
    getFormInformationService,
    getFormByInductionService,
    publishFormService,
    submitFormService,
    updateFormService,
    updateQuestionService,
    deleteQuestionService,
    getFormForApplicantService,
    saveFormDraftService,
    submitApplicationService,
} from '../services/form.service';
import { UserRole } from '../types/roles.types';
import { MemberRole } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { uploadFormFile } from '../utils/cloudinary';
import { deleteFile } from '../utils/deleteFile';

const createForm: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');
    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorised');
    const inductionId = Number(req.params.inductionId);
    if (!inductionId) throw new ApiError(400, 'Induction id needed');
    const { title, description } = formSchema.parse(req.body);

    const createdForm = await createFormService({
        title,
        description,
        role,
        inductionId
    });

    if (!createdForm) throw new ApiError(500, 'Internal Server Error');

    return res
        .status(200)
        .json(new ApiResponse(200, createdForm, 'Form created successfully'));
});

const createQuestion: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');
    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorized');

    const formId = Number(req.params.formId);
    if (!formId || isNaN(formId)) throw new ApiError(400, 'Invalid form id');

    if (Array.isArray(req.body)) {
        const questionsData = createQuestionsSchema.parse(req.body);

        const createdQuestions = await createQuestionsService(
            formId,
            questionsData
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    createdQuestions,
                    'Questions created successfully'
                )
            );
    }

    const questionData = createQuestionSchema.parse(req.body);

    const createdQuestion = await createQuestionService({
        ...questionData,
        formId
    });

    if (!createdQuestion) throw new ApiError(500, 'Internal Server Error');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createdQuestion,
                'Question created successfully'
            )
        );
});

const submitForm: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');

    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorised');

    const formId = Number(req.params.formId);
    if (!formId || isNaN(formId)) throw new ApiError(400, 'Invalid form id');
    const applicationId = Number(req.params.applicationId);
    if (!applicationId || isNaN(applicationId))
        throw new ApiError(400, 'Invalid application id');

    const { formAnswers } = req.body; //[{question_id, answer}];

    const submittedForm = await submitFormService({
        userId: user.id,
        formId,
        applicationId,
        answers: formAnswers
    });

    if (!submittedForm) throw new ApiError(500, 'Internal Server Error');

    return res
        .status(200)
        .json(
            new ApiResponse(200, submittedForm, 'Form submitted successfully')
        );
});

const publishForm: RequestHandler = asyncHandler(async (req, res) => {
    const role = req.role;
    if (!role || role != UserRole.ADMIN)
        throw new ApiError(403, 'Unauthorised');

    const formId = Number(req.params.formId);
    if (!formId || isNaN(formId)) throw new ApiError(400, 'Invalid form id');

    const clubId = Number(req.params.clubId);
    if (!formId || isNaN(clubId)) throw new ApiError(400, 'Invalid club id');

    const publishedForm = await publishFormService(formId, clubId);

    if (!publishedForm) throw new ApiError(500, 'Internal Server Error');

    return res
        .status(200)
        .json(
            new ApiResponse(200, publishedForm, 'Form published successfully')
        );
});

const getFormIndormation: RequestHandler = asyncHandler(async (req, res) => {
    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorised');

    const formId = Number(req.params.formId);
    if (!formId || isNaN(formId)) throw new ApiError(401, 'Invalid form id');

    const clubId = Number(req.params.clubId);
    if (!clubId || isNaN(clubId)) throw new ApiError(401, 'Invalid club id');

    const form = await getFormInformationService(formId, clubId);

    return res
        .status(200)
        .json(new ApiResponse(200, form, 'Form fetched suceesfully'));
});

const updateForm: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');
    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorised');

    const formId = Number(req.params.formId);
    if (!formId || isNaN(formId)) throw new ApiError(400, 'Invalid form id');

    const clubId = Number(req.params.clubId);
    if (!clubId || isNaN(clubId)) throw new ApiError(400, 'Invalid club id');

    const data = updateFormSchema.parse(req.body);

    const updatedForm = await updateFormService({ formId, clubId, ...data });

    if (!updatedForm) throw new ApiError(500, 'Internal Server Error');

    return res
        .status(200)
        .json(new ApiResponse(200, updatedForm, 'Form updated successfully'));
});

const updateQuestion: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');
    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorised');

    const formId = Number(req.params.formId);
    if (!formId || isNaN(formId)) throw new ApiError(400, 'Invalid form id');

    const questionId = Number(req.params.questionId);
    if (!questionId || isNaN(questionId))
        throw new ApiError(400, 'Invalid question id');

    const data = updateQuestionSchema.parse(req.body);

    const updatedQuestion = await updateQuestionService({
        questionId,
        formId,
        ...data
    });

    if (!updatedQuestion) throw new ApiError(500, 'Internal Server Error');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedQuestion,
                'Question updated successfully'
            )
        );
});

const deleteQuestion: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');
    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorised');

    const formId = Number(req.params.formId);
    if (!formId || isNaN(formId)) throw new ApiError(400, 'Invalid form id');

    const questionId = Number(req.params.questionId);
    if (!questionId || isNaN(questionId))
        throw new ApiError(400, 'Invalid question id');

    const deletedQuestion = await deleteQuestionService(questionId, formId);

    if (!deletedQuestion) throw new ApiError(500, 'Internal Server Error');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedQuestion,
                'Question deleted successfully'
            )
        );
});

const getFormResponse: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unathenticated');
    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorised');

    // const response = await getFormResponseService();
});

const getFormForApplicant: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');

    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorised, no role');

    if (role == UserRole.ADMIN || role == UserRole.MEMBER)
        throw new ApiError(400, 'Members cannot fill form');

    const formId = Number(req.params.formId);
    if (!formId || isNaN(formId)) throw new ApiError(400, 'Invalid form id');

    const form = await getFormForApplicantService(formId, user.id);
    if (!form) throw new ApiError(404, 'Form not found');

    if (!form.isPublished) throw new ApiError(403, 'Form is not yet published');

    const data = {
        clubId: form.induction.club.id,
        clubName: form.induction.club.name,
        clubLogo: form.induction.club.logo,
        inductionId: form.induction.id,
        inductionTitle: form.induction.title,
        formId: form.id,
        formTitle: form.title,
        formDescription: form.description,
        questions: form.questions,
        response: form.responses.length === 0 ? null : form.responses[0],
        hasApplied: form.responses[0]?.application_id !== null
    };

    return res
        .status(200)
        .json(new ApiResponse(200, data, 'Form fetched successfully'));
});

const getFormByInduction: RequestHandler = asyncHandler(async (req, res) => {
    const role = req.role;
    if (!role) throw new ApiError(403, 'Unauthorised');

    const inductionId = Number(req.params.inductionId);
    if (!inductionId || isNaN(inductionId))
        throw new ApiError(400, 'Invalid induction id');

    const form = await getFormByInductionService(inductionId);

    if (!form) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, null, 'No form found for this induction')
            );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, form, 'Form fetched successfully'));
});

const uploadFile: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');

    if (!req.file) throw new ApiError(400, 'No file uploaded');

    const allowedTypes: string[] = JSON.parse(req.body.allowedTypes || '[]');
    const maxSizeMB: number = parseFloat(req.body.maxSizeMB || '5');

    if (!Array.isArray(allowedTypes) || allowedTypes.length === 0) {
        throw new ApiError(400, 'Allowed types must be provided');
    }

    const result = await uploadFormFile(
        req.file,
        req.file.path,
        allowedTypes,
        maxSizeMB
    );

    await deleteFile(req.file.path);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { secure_url: result.secure_url, public_id: result.public_id },
                'File uploaded successfully'
            )
        );
});

const saveFormDraft: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');

    const formId = Number(req.params.formId);
    if (!formId || isNaN(formId)) throw new ApiError(400, 'Invalid form id');

    const { formAnswers } = req.body;

    if (!Array.isArray(formAnswers)) {
        throw new ApiError(400, 'formAnswers must be an array');
    }

    const response = await saveFormDraftService({
        userId: user.id,
        formId,
        answers: formAnswers
    });

    return res
        .status(200)
        .json(new ApiResponse(200, response, 'Draft saved successfully'));
});

const submitApplication: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthenticated');

    const formId = Number(req.params.formId);
    if (!formId || isNaN(formId)) throw new ApiError(400, 'Invalid form id');

    const inductionId = Number(req.params.inductionId);
    if (!inductionId || isNaN(inductionId))
        throw new ApiError(400, 'Invalid induction id');

    const { formAnswers } = req.body;

    if (!Array.isArray(formAnswers)) {
        throw new ApiError(400, 'formAnswers must be an array');
    }

    const response = await submitApplicationService({
        userId: user.id,
        formId,
        inductionId,
        answers: formAnswers
    });

    return res
        .status(200)
        .json(new ApiResponse(200, response, 'Application submitted successfully'));
});

export {
    createForm,
    createQuestion,
    submitForm,
    publishForm,
    getFormIndormation,
    getFormByInduction,
    updateForm,
    updateQuestion,
    deleteQuestion,
    getFormResponse,
    getFormForApplicant,
    uploadFile,
    saveFormDraft,
    submitApplication
};
