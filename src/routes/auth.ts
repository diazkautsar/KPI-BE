import express, { Request, Response, NextFunction } from 'express';

// controller
import AuthController from '../controllers/authController';

// use cases
import RegisterUseCase from '../useCases/authUseCase/RegisterUseCase';

// libraries
import HttpResponse from '../libraries/HttpResponse';

const httpResponse = new HttpResponse();

const useCases = {
    registerUseCase: new RegisterUseCase({}),
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
