import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import logger from './libraries/logger';
import validateEnv from './config/env';
import routes from './routes/index';

const app = async () => {
    const app = express();

    await validateEnv;
    logger.info('ENV loaded');

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
