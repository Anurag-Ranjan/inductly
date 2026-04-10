import { Router } from 'express';
import {
    createInduction,
    getInductionDetails,
    getInductions,
    publishInduction
} from '../controllers/induction.controller';

export const inductionRouter = Router();

inductionRouter.route('/').get(getInductions);
inductionRouter.route('/:id').get(getInductionDetails);
inductionRouter.route('/').post(createInduction);
inductionRouter.route('/:id').patch(publishInduction);
