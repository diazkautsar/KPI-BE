import express, { Request, Response, NextFunction } from 'express';

import authRouter from './auth';
import userRouter from './user';
import activityRouter from './activity';
import moduleRouter from './module';
import courseRouter from './course';
import utilRouter from './util';
import userCourseRouter from './userCourse';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('HELLO CAN I HELP YOU ?');
});

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/activity', activityRouter);
router.use('/module', moduleRouter);
router.use('/course', courseRouter);
router.use('/util', utilRouter);
router.use('/user-course', userCourseRouter);

export default router;
