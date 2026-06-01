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
    submitFormService
} from '../services/form.service';

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

export { createForm, createQuestion, submitForm };
