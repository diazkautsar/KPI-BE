import { Request, Response, NextFunction } from 'express';

import RegisterUseCase from '../../useCases/authUseCase/RegisterUseCase';
import HttpResponse from '../../libraries/HttpResponse';

type constructorType = {
    registerUseCase: RegisterUseCase;
    httpResponse: HttpResponse;
};

export default class AuthController {
    registerUseCase: RegisterUseCase;
    httpResponse: HttpResponse;

    constructor(args: constructorType) {
        this.registerUseCase = args.registerUseCase;
        this.httpResponse = args.httpResponse;
    }

    async register(req: Request, res: Response, next: NextFunction) {
        const response = await this.registerUseCase.exec();

        this.httpResponse.httpResponse(response, res);
    }
}
