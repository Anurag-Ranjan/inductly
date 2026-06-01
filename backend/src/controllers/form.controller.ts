import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { RequestHandler } from "express";
import { createQuestionSchema, formSchema } from "../validations/form.validations";
import { createFormService, createQuestionService } from "../services/form.service";

const createForm: RequestHandler = asyncHandler(async (req, res) => {
    const user = req.user;
    if(!user) throw new ApiError(401, "Unauthenticated");
    const role = req.role;
    if(!role) throw new ApiError(403, "Unauthorised");
    const inductionId = Number(req.params.inductionId);
    if(!inductionId) throw new ApiError(400, "Induction id needed");
    const {title, description} = formSchema.parse(req.body);

    const createdForm = await createFormService({title, description, role, inductionId});

    if(!createdForm) throw new ApiError(500, "Internal Server Error");

    return res.status(200).json(new ApiResponse(200, createdForm, "Form created successfully"));
});

const createQuestion: RequestHandler = asyncHandler(async(req, res) => {
    const user = req.user;
    if(!user) throw new ApiError(401, "Unauthenticated");
    const role = req.role;
    if(!role) throw new ApiError(403, "Unauthorized");

    const formId = Number(req.params.formId);

    const questionData = createQuestionSchema.parse(req.body);

    const createdQuestion = await createQuestionService({...questionData, formId});

    if(!createdQuestion) throw new ApiError(500, "Internal Server Error");

    return res.status(200).json(new ApiResponse(200, createdQuestion, "Question created successfully"))
});

export {createForm, createQuestion};