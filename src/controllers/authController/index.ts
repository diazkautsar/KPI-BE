import { Request, Response, NextFunction } from 'express';

import HttpResponse from '../../libraries/HttpResponse';
import RegisterUseCase from '../../useCases/authUseCase/RegisterUseCase';
import LoginUseCase from '../../useCases/authUseCase/LoginUseCase';

type constructorType = {
    httpResponse: HttpResponse;
    registerUseCase: RegisterUseCase;
    loginUseCase: LoginUseCase;
};

export default class AuthController {
    registerUseCase: RegisterUseCase;
    httpResponse: HttpResponse;
    loginUseCase: LoginUseCase;

    constructor(args: constructorType) {
        this.registerUseCase = args.registerUseCase;
        this.httpResponse = args.httpResponse;
        this.loginUseCase = args.loginUseCase;
    }

    async register(req: Request, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
        };
        const response = await this.registerUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
        };
        const response = await this.loginUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }
}
