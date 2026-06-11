import { clubRouter } from './club.route';
import { dashboardRouter } from './dashboard.route';
import { healthRouter } from './health.route';
import { inductionRouter } from './induction.route';
import { stageRouter } from './stage.route';
import { userRouter } from './user.route';
import { formRouter } from './form.route';
import { Router } from 'express';
import { applicationRouter } from './application.route';

const router = Router({
    mergeParams: true
});

router.use('/health', healthRouter);
router.use('/user', userRouter);
router.use('/dashboard', dashboardRouter);
router.use('/clubs', clubRouter);
router.use('/clubs/:clubId/inductions', inductionRouter);
router.use('/inductions', inductionRouter);
router.use('/clubs/:clubId/inductions/:inductionId/stages', stageRouter);
router.use('/clubs/:clubId/inductions/:inductionId/form', formRouter);
router.use('/applications', applicationRouter);

export default router;
