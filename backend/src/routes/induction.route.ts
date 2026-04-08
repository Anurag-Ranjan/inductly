import { Router } from 'express';
import { getInductions } from '../controllers/induction.controller';

export const inductionRouter = Router();

inductionRouter.route('/:club').get(getInductions);
