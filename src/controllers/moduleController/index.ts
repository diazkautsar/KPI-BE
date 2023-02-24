import { Response, NextFunction } from 'express';

import HttpResponse from '../../libraries/HttpResponse';
import { CustomRequest } from '../../interface/request.interface';

import CreateModuelUseCase from '../../useCases/moduleUseCase/CreateModuleUseCase';

type constructorType = {
    httpResponse: HttpResponse;
    createModuleUseCase: CreateModuelUseCase;
};

export default class ModuleController {
    httpResponse: HttpResponse;
    createModuleUseCase: CreateModuelUseCase;

    constructor(args: constructorType) {
        this.httpResponse = args.httpResponse;
        this.createModuleUseCase = args.createModuleUseCase;
    }

    async createModule(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
            user: req.user,
        };
        const response = await this.createModuleUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }
}
