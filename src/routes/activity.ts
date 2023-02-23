import express, { Request, Response, NextFunction } from 'express';

// connection
import { conn } from '../config/database';

// controller
import ActivityController from '../controllers/activityController';

// use cases
import CreateActivityUseCase from '../useCases/activityUseCase/CreateActivityUseCase';

// repositories
import ActivityRepository from '../repositories/Activity.repository';

// libraries
import HttpResponse from '../libraries/HttpResponse';

// middlewares
import { authMiddleware, permissionRole } from '../middlewares/index';

// constant
import { ROLE_ADMINISTRATOR, ROLE_LEARNER, ROLE_PROVIDER } from '../constants/index';

const httpResponse = new HttpResponse();
const activityRepository = new ActivityRepository();

const useCases = {
    createActivityUseCase: new CreateActivityUseCase({
        conn,
        activityRepository,
    }),
};

const controller = new ActivityController({
    httpResponse,
    createActivityUseCase: useCases.createActivityUseCase,
});

const router = express.Router();

router.post('/', authMiddleware, permissionRole([ROLE_ADMINISTRATOR, ROLE_PROVIDER]), async (req, res, next) => {
    try {
        await controller.createActivity(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default router;
