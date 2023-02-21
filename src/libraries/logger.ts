import { createLogger, transports, format } from 'winston';
import { env } from '../config/env';

const enumerateErrorFormat = format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const logger = createLogger({
    level: env.ENV === 'development' || env.ENV === 'local' ? 'debug' : 'info',
    format: format.combine(
        enumerateErrorFormat(),
        env.ENV === 'development' || env.ENV === 'local' ? format.colorize() : format.uncolorize(),
        format.splat(),
        format.printf(({ level, message }) => `${level}: ${message}`)
    ),
    transports: [
        new transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});

export default logger;
