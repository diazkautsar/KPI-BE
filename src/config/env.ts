import joi from 'joi';

const envSchema = joi
    .object({
        APP_NAME: joi.string().default('kpi-backend-services').required(),
        ENV: joi.string().valid('local', 'development', 'staging', 'production').required(),
        PORT: joi.string().required().default('3000'),
        DATABASE_URL: joi.string().required(),
        SECRET_KEY: joi.string().required(),
        SALT_ROUNDS: joi.number().required(),
        IMAGEKIT_PUBLIC_KEY: joi.string().required(),
        IMAGEKIT_PRIVATE_KEY: joi.string().required(),
        IMAGEKIT_URL_ENDPOINT: joi.string().required(),
    })
    .unknown()
    .required();

export const env = Object.freeze({
    APP_NAME: process.env.APP_NAME,
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL || '',
    SECRET_KEY: process.env.SECRET_KEY || '',
    SALT_ROUNDS: process.env.SALT_ROUNDS || '12',
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY || '',
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || '',
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

const validateEnv = envSchema.validateAsync(env);

export default validateEnv;
