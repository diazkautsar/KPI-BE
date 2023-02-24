import { Response, NextFunction } from 'express';

import HttpResponse from '../../libraries/HttpResponse';
import { CustomRequest } from '../../interface/request.interface';
import Utililty from '../../utilities';
import CreateModuelUseCase from '../../useCases/moduleUseCase/CreateModuleUseCase';
import GetModuleUseCase from '../../useCases/moduleUseCase/GetModuleUseCase';
import UpdateModuleUseCase from '../../useCases/moduleUseCase/UpdateModuleUseCase';

type constructorType = {
    httpResponse: HttpResponse;
    createModuleUseCase: CreateModuelUseCase;
    getModuleUseCase: GetModuleUseCase;
    updateModuleUseCase: UpdateModuleUseCase;
};

export default class ModuleController {
    httpResponse: HttpResponse;
    createModuleUseCase: CreateModuelUseCase;
    getModuleUseCase: GetModuleUseCase;
    updateModuleUseCase: UpdateModuleUseCase;

    constructor(args: constructorType) {
        this.httpResponse = args.httpResponse;
        this.createModuleUseCase = args.createModuleUseCase;
        this.getModuleUseCase = args.getModuleUseCase;
        this.updateModuleUseCase = args.updateModuleUseCase;
    }

    async createModule(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
            user: req.user,
        };
        const response = await this.createModuleUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }

    async getModuleById(req: CustomRequest, res: Response, next: NextFunction) {
        let is_active: boolean = true;
        const id = req.params.moduleId;
        if (!id) {
            next({
                statusCode: 400,
                message: 'Invalid activity id',
                messageTitle: 'Bad request',
            });
        }

        if (req.query.is_active) {
            const data = req.query.is_active as string;
            is_active = Utililty.trueOrFalse(data);
        }

        const payload = [id];

        const response = await this.getModuleUseCase.exec(payload, is_active);

        this.httpResponse.httpResponse(response, res);
    }

    async getModules(req: CustomRequest, res: Response, next: NextFunction) {
        let is_active: boolean = true;
        if (req.query.is_active) {
            const data = req.query.is_active as string;
            is_active = Utililty.trueOrFalse(data);
        }

        const response = await this.getModuleUseCase.exec(null, is_active);

        this.httpResponse.httpResponse(response, res);
    }

    async updateModule(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
        };

        const response = await this.updateModuleUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }
}
