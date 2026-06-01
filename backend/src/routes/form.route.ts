import { Router } from 'express';
import { createForm, submitForm } from '../controllers/form.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorizeClubRole } from '../middlewares/role.middleware';

const formRouter = Router();

formRouter.route('/').post(authMiddleware, authorizeClubRole, createForm);
formRouter
    .route('/:formId')
    .post(authMiddleware, authorizeClubRole, createForm);
//Change the route of the create form functionality
formRouter
    .route('/:formId/applications/:applicationId')
    .post(authMiddleware, authorizeClubRole, submitForm);

export { formRouter };
