import { clubRouter } from './club.route';
import { dashboardRouter } from './dashboard.routes';
import { healthRouter } from './health.routes';
import { userRouter } from './user.routes';
import { Router } from 'express';

const router = Router();

router.use('/health', healthRouter);
router.use('/user', userRouter);
router.use('/dashboard', dashboardRouter);
router.use('/clubs', clubRouter);

export default router;
