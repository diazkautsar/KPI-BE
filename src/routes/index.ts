import express, { Request, Response, NextFunction } from 'express';

import authRouter from './auth';
import userRouter from './user';
import activityRouter from './activity';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('HELLO CAN I HELP YOU ?');
});

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/activity', activityRouter);

export default router;
