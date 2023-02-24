import express, { Request, Response, NextFunction } from 'express';

// connection
import { conn } from '../config/database';

// controller
import ModuleController from '../controllers/moduleController';

// use cases
import CreateModuelUseCase from '../useCases/moduleUseCase/CreateModuleUseCase';
import GetModuleUseCase from '../useCases/moduleUseCase/GetModuleUseCase';

// repositories
import ModuleRepository from '../repositories/Module.repository';
import ActivityRepository from '../repositories/Activity.repository';

// libraries
import HttpResponse from '../libraries/HttpResponse';

// middlewares
import { authMiddleware, permissionRole } from '../middlewares/index';

// constant
import { ROLE_ADMINISTRATOR, ROLE_LEARNER, ROLE_PROVIDER } from '../constants/index';
import { CustomRequest } from '../interface/request.interface';

const httpResponse = new HttpResponse();
const moduleRepository = new ModuleRepository();
const activityRepository = new ActivityRepository();

const useCases = {
    createModuleUseCase: new CreateModuelUseCase({
        conn,
        moduleRepository,
        activityRepository,
    }),
    getModuleUseCase: new GetModuleUseCase({
        moduleRepository,
    }),
};

const controller = new ModuleController({
    httpResponse,
    createModuleUseCase: useCases.createModuleUseCase,
    getModuleUseCase: useCases.getModuleUseCase,
});

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    permissionRole([ROLE_ADMINISTRATOR, ROLE_PROVIDER]),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            await controller.createModule(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:moduleId', authMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        await controller.getModuleById(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.get('/', authMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        await controller.getModules(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default router;
