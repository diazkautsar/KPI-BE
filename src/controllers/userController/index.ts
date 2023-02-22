import { Request, Response, NextFunction } from 'express';

import HttpResponse from '../../libraries/HttpResponse';
import CreateUserUseCase from '../../useCases/userUseCase/CreateUserUseCase';
import { CustomRequest } from '../../interface/request.interface';

type constructorType = {
    httpResponse: HttpResponse;
    createUserUseCase: CreateUserUseCase;
};

export default class UserController {
    httpResponse: HttpResponse;
    createUserUseCase: CreateUserUseCase;

    constructor(args: constructorType) {
        this.httpResponse = args.httpResponse;
        this.createUserUseCase = args.createUserUseCase;
    }

    async createUser(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
            user: req.user,
        };
        const response = await this.createUserUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }
}
