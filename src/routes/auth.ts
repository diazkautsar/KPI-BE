import express, { Request, Response, NextFunction } from 'express';

// connection
import { conn } from '../config/database';

// controller
import AuthController from '../controllers/authController';

// use cases
import RegisterUseCase from '../useCases/authUseCase/RegisterUseCase';
import LoginUseCase from '../useCases/authUseCase/LoginUseCase';

// repositories
import UserRoleRepository from '../repositories/UserRole.repository';
import UserRepository from '../repositories/User.repository';

// libraries
import HttpResponse from '../libraries/HttpResponse';
import Bcrypt from '../libraries/Bcrypt';
import Jwt from '../libraries/Jwt';

const httpResponse = new HttpResponse();
const userRoleRepository = new UserRoleRepository();
const userRepository = new UserRepository();
const bcrypt = new Bcrypt();
const jwt = new Jwt();

const useCases = {
    registerUseCase: new RegisterUseCase({
        userRoleRepository,
        bcrypt,
        userRepository,
        conn,
    }),
    loginUseCase: new LoginUseCase({
        userRepository,
        bcrypt,
        jwt,
    }),
};

const controler = new AuthController({
    httpResponse,
    registerUseCase: useCases.registerUseCase,
    loginUseCase: useCases.loginUseCase,
});

const router = express.Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await controler.register(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await controler.login(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default router;
