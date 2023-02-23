import express, { Request, Response, NextFunction } from 'express';

// connection
import { conn } from '../config/database';

// controller
import ActivityController from '../controllers/activityController';

// use cases
import CreateActivityUseCase from '../useCases/activityUseCase/CreateActivityUseCase';
import GetActivityUseCase from '../useCases/activityUseCase/GetActivityUseCase';
import UpdateActivityUseCase from '../useCases/activityUseCase/UpdateActivityUseCase';

// repositories
import ActivityRepository from '../repositories/Activity.repository';

// libraries
import HttpResponse from '../libraries/HttpResponse';

// middlewares
import { authMiddleware, permissionRole } from '../middlewares/index';

// constant
import { ROLE_ADMINISTRATOR, ROLE_LEARNER, ROLE_PROVIDER } from '../constants/index';
import { CustomRequest } from '../interface/request.interface';

const httpResponse = new HttpResponse();
const activityRepository = new ActivityRepository();

const useCases = {
    createActivityUseCase: new CreateActivityUseCase({
        conn,
        activityRepository,
    }),
    getActivityUseCase: new GetActivityUseCase({
        activityRepository,
    }),
    updateActivityUseCase: new UpdateActivityUseCase({
        conn,
        activityRepository,
    }),
};

const controller = new ActivityController({
    httpResponse,
    createActivityUseCase: useCases.createActivityUseCase,
    getActivityUseCase: useCases.getActivityUseCase,
    updateActivityUseCase: useCases.updateActivityUseCase,
});

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    permissionRole([ROLE_ADMINISTRATOR, ROLE_PROVIDER]),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            await controller.createActivity(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:activityId', authMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        await controller.getActivityById(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.get('/', authMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        await controller.getActivities(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.put(
    '/',
    authMiddleware,
    permissionRole([ROLE_ADMINISTRATOR, ROLE_PROVIDER]),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            await controller.updateActivity(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    '/:activityId',
    authMiddleware,
    permissionRole([ROLE_ADMINISTRATOR, ROLE_PROVIDER]),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            await controller.deleteActivity(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
