import { Request, ErrorRequestHandler } from 'express';
import { CustomJwtPayload } from './jwt.interface';

export interface CustomRequest extends Request {
    user?: CustomJwtPayload;
}

export interface CustomErrorRequestHandler extends ErrorRequestHandler {
    type?: string;
    statusCode?: number;
    message?: string;
    messageTitle?: string;
}
