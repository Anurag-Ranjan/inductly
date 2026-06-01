import { clubRouter } from './club.route';
import { dashboardRouter } from './dashboard.routes';
import { healthRouter } from './health.routes';
import { inductionRouter } from './induction.route';
import { stageRouter } from './stage.routes';
import { userRouter } from './user.routes';
import { formRouter } from './form.route';
import { Router } from 'express';

const router = Router();

router.use('/health', healthRouter);
router.use('/user', userRouter);
router.use('/dashboard', dashboardRouter);
router.use('/clubs', clubRouter);
router.use('/clubs/:clubId/inductions', inductionRouter);
router.use('/clubs/:clubId/inductions/:inductionId/stages', stageRouter);
router.use('/inductions/:inductionId/form', formRouter);

export default router;
