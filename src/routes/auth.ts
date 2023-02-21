import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    res.send('HELLO FOR SIGNUPO');
});

export default router;
