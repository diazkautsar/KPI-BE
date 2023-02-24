import { Response, NextFunction } from 'express';

import HttpResponse from '../../libraries/HttpResponse';
import { CustomRequest } from '../../interface/request.interface';
import Utililty from '../../utilities';

import CreateCourseUseCase from '../../useCases/courseUseCase/CreateCourseUseCase';
import GetCourseUseCase from '../../useCases/courseUseCase/GetCourseUseCase';
import UpdateCourseUseCase from '../../useCases/courseUseCase/UpdateCourseUseCase';

type constructorType = {
    httpResponse: HttpResponse;
    createCourseUseCase: CreateCourseUseCase;
    getCourseUseCase: GetCourseUseCase;
    updateCourseUseCase: UpdateCourseUseCase;
};

export default class CourseController {
    httpResponse: HttpResponse;
    createCourseUseCase: CreateCourseUseCase;
    getCourseUseCase: GetCourseUseCase;
    updateCourseUseCase: UpdateCourseUseCase;

    constructor(args: constructorType) {
        this.httpResponse = args.httpResponse;
        this.createCourseUseCase = args.createCourseUseCase;
        this.getCourseUseCase = args.getCourseUseCase;
        this.updateCourseUseCase = args.updateCourseUseCase;
    }

    async createCourse(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
            user: req.user,
        };
        const response = await this.createCourseUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }

    async getCourseById(req: CustomRequest, res: Response, next: NextFunction) {
        let is_active: boolean = true;
        const id = req.params.courseId;
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

        const response = await this.getCourseUseCase.exec(payload, is_active);

        this.httpResponse.httpResponse(response, res);
    }

    async getCourses(req: CustomRequest, res: Response, next: NextFunction) {
        let is_active: boolean = true;
        if (req.query.is_active) {
            const data = req.query.is_active as string;
            is_active = Utililty.trueOrFalse(data);
        }

        const response = await this.getCourseUseCase.exec(null, is_active);

        this.httpResponse.httpResponse(response, res);
    }

    async updateCourse(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: req.body,
        };

        const response = await this.updateCourseUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }

    async deleteCourse(req: CustomRequest, res: Response, next: NextFunction) {
        const payload = {
            body: {
                is_active: false,
                id: req.params.courseId,
            },
        };

        const response = await this.updateCourseUseCase.exec(payload);

        this.httpResponse.httpResponse(response, res);
    }
}
