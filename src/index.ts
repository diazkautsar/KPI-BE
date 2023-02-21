import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';
import logger from './libraries/logger';
import { env } from './config/env';

(async () => {
    try {
        const PORT = parseInt(env.PORT || '3000');
        const instance = await app();

        await instance.listen(PORT, () => {
            console.log('server running on port ', PORT);
        });
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
})();
