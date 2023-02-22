import { Response, NextFunction } from 'express';

import HttpResponse from '../../libraries/HttpResponse';
import CreateUserUseCase from '../../useCases/userUseCase/CreateUserUseCase';
import GetUserUseCase from '../../useCases/userUseCase/GetUserUseCase';
import { CustomRequest } from '../../interface/request.interface';

type constructorType = {
    httpResponse: HttpResponse;
    createUserUseCase: CreateUserUseCase;
    getUserUseCase: GetUserUseCase;
};

export default class UserController {
    httpResponse: HttpResponse;
    createUserUseCase: CreateUserUseCase;
    getUserUseCase: GetUserUseCase;

    constructor(args: constructorType) {
        this.httpResponse = args.httpResponse;
        this.createUserUseCase = args.createUserUseCase;
        this.getUserUseCase = args.getUserUseCase;
    }

    async createUser(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
            user: req.user,
        };
        const response = await this.createUserUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }

    async getUserById(req: CustomRequest, res: Response, next: NextFunction) {
        console.log(req.params.userId);
        const id = req.params.userId;
        const payload = [id];
        const response = await this.getUserUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }
}
