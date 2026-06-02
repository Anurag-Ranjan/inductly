import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { RequestHandler } from 'express';
import {
    createQuestionSchema,
    formSchema
} from '../validations/form.validations';
import {
    createFormService,
    createQuestionService,
    getFormInformationService,
    publishFormService,
    submitFormService
} from '../services/form.service';
import { UserRole } from '../types/roles.types';

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

const updateForm: RequestHandler = asyncHandler(async (req, res) => {});

const getFormResponse: RequestHandler = asyncHandler(async (req, res) => {});

export {
    createForm,
    createQuestion,
    submitForm,
    publishForm,
    getFormIndormation,
    updateForm,
    getFormResponse
};
