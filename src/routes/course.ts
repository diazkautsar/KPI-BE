import express, { Request, Response, NextFunction } from 'express';

// connection
import { conn } from '../config/database';

// controller
import CourseController from '../controllers/courseController';

// use cases
import CreateCourseUseCase from '../useCases/courseUseCase/CreateCourseUseCase';
import GetCourseUseCase from '../useCases/courseUseCase/GetCourseUseCase';
import UpdateCourseUseCase from '../useCases/courseUseCase/UpdateCourseUseCase';

// repositories
import CourseRepository from '../repositories/Course.repository';
import ModuleRepository from '../repositories/Module.repository';

// libraries
import HttpResponse from '../libraries/HttpResponse';

// middlewares
import { authMiddleware, permissionRole } from '../middlewares/index';

// constant
import { ROLE_ADMINISTRATOR, ROLE_LEARNER, ROLE_PROVIDER } from '../constants/index';
import { CustomRequest } from '../interface/request.interface';

const httpResponse = new HttpResponse();
const courseRepository = new CourseRepository();
const moduleRepository = new ModuleRepository();

const useCases = {
    createCourseUseCase: new CreateCourseUseCase({
        conn,
        courseRepository,
        moduleRepository,
    }),
    getCourseUseCase: new GetCourseUseCase({
        courseRepository,
    }),
    updateCourseUseCase: new UpdateCourseUseCase(),
};

const controller = new CourseController({
    httpResponse,
    createCourseUseCase: useCases.createCourseUseCase,
    getCourseUseCase: useCases.getCourseUseCase,
    updateCourseUseCase: useCases.updateCourseUseCase,
});

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    permissionRole([ROLE_ADMINISTRATOR, ROLE_PROVIDER]),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            await controller.createCourse(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:courseId', authMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        await controller.getCourseById(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.get('/', authMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        await controller.getCourses(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.put('/', authMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        await controller.updateCourse(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.delete(
    '/:courseId',
    authMiddleware,
    permissionRole([ROLE_ADMINISTRATOR, ROLE_PROVIDER]),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            await controller.deleteCourse(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
