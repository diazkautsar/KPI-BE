import express from 'express';

import logger from './libraries/logger';
import validateEnv from './config/env';
import routes from './routes/index';

const app = async () => {
    const app = express();

    await validateEnv;
    logger.info('ENV loaded');

    app.use(routes);

    return app;
};

export default app;
