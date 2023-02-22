import { Response, NextFunction } from 'express';

import HttpResponse from '../../libraries/HttpResponse';
import CreateUserUseCase from '../../useCases/userUseCase/CreateUserUseCase';
import GetUserUseCase from '../../useCases/userUseCase/GetUserUseCase';
import GetAllUserUseCase from '../../useCases/userUseCase/GetAllUserUseCase';
import { CustomRequest } from '../../interface/request.interface';
import Utililty from '../../utilities';

type constructorType = {
    httpResponse: HttpResponse;
    createUserUseCase: CreateUserUseCase;
    getUserUseCase: GetUserUseCase;
    getAllUserUseCase: GetAllUserUseCase;
};

export default class UserController {
    httpResponse: HttpResponse;
    createUserUseCase: CreateUserUseCase;
    getUserUseCase: GetUserUseCase;
    getAllUserUseCase: GetAllUserUseCase;

    constructor(args: constructorType) {
        this.httpResponse = args.httpResponse;
        this.createUserUseCase = args.createUserUseCase;
        this.getUserUseCase = args.getUserUseCase;
        this.getAllUserUseCase = args.getAllUserUseCase;
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
        const id = req.params.userId;
        const payload = [id];
        const response = await this.getUserUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }

    async getUsers(req: CustomRequest, res: Response, next: NextFunction) {
        let is_active: boolean = true;
        let is_blocked: boolean = false;

        if (req.query.is_active) {
            const data = req.query.is_active as string;
            is_active = Utililty.trueOrFalse(data);
        }

        if (req.query.is_blocked) {
            const data = req.query.is_blocked as string;
            is_blocked = Utililty.trueOrFalse(data);
        }

        const response = await this.getAllUserUseCase.exec({ is_active, is_blocked });

        this.httpResponse.httpResponse(response, res);
    }
}
