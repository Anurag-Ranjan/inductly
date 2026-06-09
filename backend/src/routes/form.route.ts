import { Router } from 'express';
import {
    createForm,
    createQuestion,
    publishForm,
    submitForm,
    getFormIndormation,
    getFormByInduction,
    updateForm,
    updateQuestion,
    deleteQuestion
} from '../controllers/form.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeClubRole } from '../middlewares/role.middleware';

const formRouter = Router({ mergeParams: true });

formRouter
    .route('/')
    .get(authMiddleware, authorizeClubRole, getFormByInduction)
    .post(authMiddleware, authorizeClubRole, createForm);

formRouter
    .route('/:formId')
    .get(authMiddleware, authorizeClubRole, getFormIndormation)
    .patch(authMiddleware, authorizeClubRole, updateForm);

formRouter
    .route('/:formId/questions')
    .post(authMiddleware, authorizeClubRole, createQuestion);

formRouter
    .route('/:formId/questions/:questionId')
    .patch(authMiddleware, authorizeClubRole, updateQuestion)
    .delete(authMiddleware, authorizeClubRole, deleteQuestion);

formRouter
    .route('/:formId/publish')
    .post(authMiddleware, authorizeClubRole, publishForm);

formRouter
    .route('/:formId/applications/:applicationId')
    .post(authMiddleware, authorizeClubRole, submitForm);

export { formRouter };
