import { NextFunction, Response, Request } from 'express';
import Jwt from '../libraries/Jwt';

import { CustomRequest } from '../interface/request.interface';

const messageInvalidToken: string =
    "We're sorry, your login token has expired or is invalid. Please log in again to continue using our service.";
const messageErrorTitle: string = 'Invalid or Expired Token';
const jwt = new Jwt();

function toResponse(errorTitle: string = messageErrorTitle, erroMessage: string = messageInvalidToken) {
    return {
        statusCode: 400,
        message: erroMessage,
        messageTitle: errorTitle,
    };
}

export const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const headerAuthorization = req.headers.authorization ?? '';
    const bearer = headerAuthorization.split(' ')[0];
    const token = headerAuthorization.split(' ')[1];

    if (!token || bearer !== 'Bearer') {
        return next({
            type: 'invalid_token',
            ...toResponse(),
        });
    }

    const verifyToken = await jwt.verify(token);
    if (!verifyToken) {
        return next({
            type: 'invalid_token',
            ...toResponse(),
        });
    }

    req.user = verifyToken;

    next();
};

export const permissionRole = (rolesGetPermission: string[]) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        const userRole = req.user?.role_slug ?? '';
        if (!rolesGetPermission.includes(userRole)) {
            return next({
                type: 'permission_role_error',
                statusCode: 400,
                message: 'Access Denied',
                messageTitle: 'you do not have permission to perform this operation',
            });
        }

        next();
    };
};
