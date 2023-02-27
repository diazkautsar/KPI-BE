import { Response, NextFunction } from 'express';

import HttpResponse from '../../libraries/HttpResponse';
import { CustomRequest } from '../../interface/request.interface';
import Utililty from '../../utilities';

import CreateUserCourseUseCase from '../../useCases/userCourseUseCase/CreateUserCourseUseCase';

type constructorType = {
    httpResponse: HttpResponse;
    createUserCourseUseCase: CreateUserCourseUseCase;
};

export default class UserCourseController {
    httpResponse: HttpResponse;
    createUserCourseUseCase: CreateUserCourseUseCase;

    constructor(args: constructorType) {
        this.httpResponse = args.httpResponse;
        this.createUserCourseUseCase = args.createUserCourseUseCase;
    }

    async createUserCourse(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
            user: req.user,
        };
        const response = await this.createUserCourseUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }
}
