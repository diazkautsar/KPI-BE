import { NextFunction, Response, Request } from 'express';
import Jwt from '../libraries/Jwt';

import { CustomRequest } from '../interface/request.interface';

type constructorType = {
    jwt: Jwt;
};

export default class Middleware {
    jwt: Jwt;
    messageInvalidToken: string;
    messageErrorTitle: string;

    constructor(args: constructorType) {
        this.jwt = args.jwt;
        this.messageInvalidToken =
            "We're sorry, your login token has expired or is invalid. Please log in again to continue using our service.";
        this.messageErrorTitle = 'Invalid or Expired Token';
    }

    toResponse() {
        return {
            statusCode: 400,
            message: this.messageInvalidToken,
            messageTitle: this.messageErrorTitle,
        };
    }

    async authMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
        const headerAuthorization = req.headers.authorization ?? '';
        const bearer = headerAuthorization.split(' ')[0];
        const token = headerAuthorization.split(' ')[1];

        if (!token || bearer !== 'Bearer') {
            return res.status(400).send(this.toResponse());
        }

        const verifyToken = await this.jwt.verify(token);
        if (!verifyToken) {
            return res.status(400).send(this.toResponse());
        }

        req.user = verifyToken;

        next();
    }
}
