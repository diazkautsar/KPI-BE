import express, { Request, Response, NextFunction } from 'express';

// connection
import { conn } from '../config/database';

// controller
import UserController from '../controllers/userController';

// use cases
import CreateUserUseCase from '../useCases/userUseCase/CreateUserUseCase';
import GetUserUseCase from '../useCases/userUseCase/GetUserUseCase';
import GetAllUserUseCase from '../useCases/userUseCase/GetAllUserUseCase';

// repositories
import UserRoleRepository from '../repositories/UserRole.repository';
import UserRepository from '../repositories/User.repository';

// libraries
import HttpResponse from '../libraries/HttpResponse';
import Jwt from '../libraries/Jwt';
import Bcrypt from '../libraries/Bcrypt';

// middlewares
import { authMiddleware } from '../middlewares/index';

const jwt = new Jwt();
const httpResponse = new HttpResponse();
const userRoleRepository = new UserRoleRepository();
const userRepository = new UserRepository();
const bcrypt = new Bcrypt();

const useCases = {
    createUserUseCase: new CreateUserUseCase({
        userRoleRepository,
        bcrypt,
        userRepository,
        conn,
    }),
    getUserUseCase: new GetUserUseCase({
        userRepository,
    }),
    getAllUserUseCase: new GetAllUserUseCase({
        userRepository,
    }),
};

const controller = new UserController({
    httpResponse,
    createUserUseCase: useCases.createUserUseCase,
    getUserUseCase: useCases.getUserUseCase,
    getAllUserUseCase: useCases.getAllUserUseCase,
});

const router = express.Router();

router.post('/add', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await controller.createUser(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.get('/:userId', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await controller.getUserById(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await controller.getUsers(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default router;
