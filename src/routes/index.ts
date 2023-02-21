import express, { Request, Response, NextFunction } from 'express';

import authRouter from './auth';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('HELLO CAN I HELP YOU ?');
});

router.use('/auth', authRouter);

export default router;
