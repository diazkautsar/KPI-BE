import express, { Request, Response, NextFunction } from 'express';

// connection
import { conn } from '../config/database';

// controller
import UserCourseController from '../controllers/userCourseController';

// use cases
import CreateUserCourseUseCase from '../useCases/userCourseUseCase/CreateUserCourseUseCase';

// repositories
import UserRepository from '../repositories/User.repository';
import UserCourseRepository from '../repositories/UserCourse.repository';
import CourseRepository from '../repositories/Course.repository';
import UserRoleRepository from '../repositories/UserRole.repository';

// libraries
import HttpResponse from '../libraries/HttpResponse';

// middlewares
import { authMiddleware, permissionRole } from '../middlewares/index';

// constant
import { ROLE_ADMINISTRATOR, ROLE_LEARNER, ROLE_PROVIDER } from '../constants/index';
import { CustomRequest } from '../interface/request.interface';

const httpResponse = new HttpResponse();
const userRepository = new UserRepository();
const courseRepository = new CourseRepository();
const userCourseRepository = new UserCourseRepository();
const userRoleRepository = new UserRoleRepository();

const useCases = {
    createUserCourseUseCase: new CreateUserCourseUseCase({
        conn,
        courseRepository,
        userCourseRepository,
        userRepository,
        userRoleRepository,
    }),
};

const controller = new UserCourseController({
    httpResponse,
    createUserCourseUseCase: useCases.createUserCourseUseCase,
});

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    permissionRole([ROLE_ADMINISTRATOR, ROLE_PROVIDER]),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            await controller.createUserCourse(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
