import { Response, NextFunction } from 'express';

import HttpResponse from '../../libraries/HttpResponse';
import CreateActivityUseCase from '../../useCases/activityUseCase/CreateActivityUseCase';
import { CustomRequest } from '../../interface/request.interface';

type constructorType = {
    httpResponse: HttpResponse;
    createActivityUseCase: CreateActivityUseCase;
};

export default class ActivityController {
    httpResponse: HttpResponse;
    createActivityUseCase: CreateActivityUseCase;

    constructor(args: constructorType) {
        (this.httpResponse = args.httpResponse), (this.createActivityUseCase = args.createActivityUseCase);
    }

    async createActivity(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
            user: req.user,
        };
        const response = await this.createActivityUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }
}
