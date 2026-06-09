import { Router } from 'express';
import {
    createForm,
    publishForm,
    submitForm,
    getFormIndormation
} from '../controllers/form.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeClubRole } from '../middlewares/role.middleware';

const formRouter = Router({ mergeParams: true });

formRouter.route('/').post(authMiddleware, authorizeClubRole, createForm);
formRouter
    .route('/:formId')
    .post(authMiddleware, authorizeClubRole, createForm);
//Change the route of the create form functionality
formRouter
    .route('/:formId/applications/:applicationId')
    .post(authMiddleware, authorizeClubRole, submitForm);
formRouter
    .route('/:formId/publish')
    .post(authMiddleware, authorizeClubRole, publishForm);
formRouter
    .route('/:formId')
    .get(authMiddleware, authorizeClubRole, getFormIndormation);

export { formRouter };
