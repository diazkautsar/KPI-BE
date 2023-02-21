import express, { Request, Response, NextFunction } from 'express';

// connection
import { conn } from '../config/database';

// controller
import AuthController from '../controllers/authController';

// use cases
import RegisterUseCase from '../useCases/authUseCase/RegisterUseCase';

// repositories
import UserRoleRepository from '../repositories/UserRole.repository';
import UserRepository from '../repositories/User.repository';

// libraries
import HttpResponse from '../libraries/HttpResponse';
import Bcrypt from '../libraries/Bcrypt';

const httpResponse = new HttpResponse();

const useCases = {
    registerUseCase: new RegisterUseCase({
        userRoleRepository: new UserRoleRepository(),
        bcrypt: new Bcrypt(),
        userRepository: new UserRepository(),
        conn,
    }),
};

const controler = new AuthController({
    httpResponse,
    registerUseCase: useCases.registerUseCase,
});

const router = express.Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await controler.register(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default router;
