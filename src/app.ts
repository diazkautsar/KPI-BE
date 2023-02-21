import express from 'express';

import logger from './libraries/logger';
import validateEnv from './config/env';

const app = async () => {
    const app = express();

    await validateEnv;
    logger.info('ENV loaded');

    app.get('/', (req, res, next) => {
        res.send('HELLO CAN I HELP YOU ?');
    });

    return app;
};

export default app;
