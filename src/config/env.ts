import joi from 'joi';

const envSchema = joi
    .object({
        APP_NAME: joi.string().default('kpi-backend-services').required(),
        ENV: joi.string().valid('local', 'development', 'staging', 'production').required(),
        PORT: joi.string().required().default('3000'),
    })
    .unknown()
    .required();

export const env = Object.freeze({
    APP_NAME: process.env.APP_NAME,
    ENV: process.env.ENV,
    PORT: process.env.PORT,
});

const validateEnv = envSchema.validateAsync(env);

export default validateEnv;
