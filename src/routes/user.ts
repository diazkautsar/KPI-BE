import express, { Request, Response, NextFunction } from 'express';

// connection
import { conn } from '../config/database';

// controller
import UserController from '../controllers/userController';

// use cases
import CreateUserUseCase from '../useCases/userUseCase/CreateUserUseCase';

// repositories
import UserRoleRepository from '../repositories/UserRole.repository';
import UserRepository from '../repositories/User.repository';

// libraries
import HttpResponse from '../libraries/HttpResponse';
import Jwt from '../libraries/Jwt';
import Bcrypt from '../libraries/Bcrypt';

// middlewares
import Middleware from '../middlewares/index';

const jwt = new Jwt();
const httpResponse = new HttpResponse();
const userRoleRepository = new UserRoleRepository();
const userRepository = new UserRepository();
const middleware = new Middleware({ jwt });
const bcrypt = new Bcrypt();

const useCases = {
    createUserUseCase: new CreateUserUseCase({
        userRoleRepository,
        bcrypt,
        userRepository,
        conn,
    }),
};

const controller = new UserController({
    httpResponse,
    createUserUseCase: useCases.createUserUseCase,
});

const router = express.Router();

router.post(
    '/add',
    middleware.authMiddleware.bind(middleware),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller.createUser(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
