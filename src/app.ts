import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import logger from './libraries/logger';
import validateEnv, { env } from './config/env';
import routes from './routes/index';
import { connectDatabase } from './config/database';

import mongoose from 'mongoose';

const app = async () => {
    const app = express();

    await validateEnv;
    logger.info('ENV loaded');

    await connectDatabase();
    logger.info('Success connect database');

    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    if (env.ENV === 'development') {
        mongoose.set('debug', true);
    }

    app.use(routes);

    app.use((req: Request, res: Response, _next: NextFunction) => {
        res.status(404).json({
            success: false,
            message: 'Path not found',
        });
    });

    app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
        logger.error(err.toString());
        res.status(500).send({
            success: false,
            message: 'INTERNAL SERVER ERROR',
        });
    });

    return app;
};

export default app;
