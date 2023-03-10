import { Response, NextFunction } from 'express';

import HttpResponse from '../../libraries/HttpResponse';
import CreateActivityUseCase from '../../useCases/activityUseCase/CreateActivityUseCase';
import GetActivityUseCase from '../../useCases/activityUseCase/GetActivityUseCase';
import UpdateActivityUseCase from '../../useCases/activityUseCase/UpdateActivityUseCase';
import { CustomRequest } from '../../interface/request.interface';
import Utililty from '../../utilities';

type constructorType = {
    httpResponse: HttpResponse;
    createActivityUseCase: CreateActivityUseCase;
    getActivityUseCase: GetActivityUseCase;
    updateActivityUseCase: UpdateActivityUseCase;
};

export default class ActivityController {
    httpResponse: HttpResponse;
    createActivityUseCase: CreateActivityUseCase;
    getActivityUseCase: GetActivityUseCase;
    updateActivityUseCase: UpdateActivityUseCase;

    constructor(args: constructorType) {
        this.httpResponse = args.httpResponse;
        this.createActivityUseCase = args.createActivityUseCase;
        this.getActivityUseCase = args.getActivityUseCase;
        this.updateActivityUseCase = args.updateActivityUseCase;
    }

    async createActivity(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
            user: req.user,
        };
        const response = await this.createActivityUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }

    async getActivityById(req: CustomRequest, res: Response, next: NextFunction) {
        let is_active: boolean = true;
        const id = req.params.activityId;
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

        const response = await this.getActivityUseCase.exec(payload, is_active);

        this.httpResponse.httpResponse(response, res);
    }

    async getActivities(req: CustomRequest, res: Response, next: NextFunction) {
        let is_active: boolean = true;
        if (req.query.is_active) {
            const data = req.query.is_active as string;
            is_active = Utililty.trueOrFalse(data);
        }

        const response = await this.getActivityUseCase.exec(null, is_active);

        this.httpResponse.httpResponse(response, res);
    }

    async updateActivity(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
        };

        const response = await this.updateActivityUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }

    async deleteActivity(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: {
                is_active: false,
                id: req.params.activityId,
            },
        };

        const response = await this.updateActivityUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }
}
