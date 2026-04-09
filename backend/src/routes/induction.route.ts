import { Router } from 'express';
import {
    createInduction,
    getInductionDetails,
    getInductions
} from '../controllers/induction.controller';

export const inductionRouter = Router();

inductionRouter.route('/').get(getInductions);
inductionRouter.route('/:id').get(getInductionDetails);
inductionRouter.route('/').post(createInduction);
