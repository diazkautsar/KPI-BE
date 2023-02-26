import express, { Request, Response, NextFunction } from 'express';

// connection
import { conn } from '../config/database';

// controller
import UtilController from '../controllers/utilController';

// use cases
import GetImageKitTokenUseCase from '../useCases/utilUseCase/GetImageKitTokenUseCase';

// repositories

// libraries
import HttpResponse from '../libraries/HttpResponse';
import ImagekitSDK from '../libraries/Imagkit';

// middlewares
import { authMiddleware, permissionRole } from '../middlewares/index';
import { ROLE_ADMINISTRATOR, ROLE_PROVIDER } from '../constants/index';

const httpResponse = new HttpResponse();
const imagekitSDK = new ImagekitSDK();

const useCases = {
    getImageKitTokenUseCase: new GetImageKitTokenUseCase({
        imagekitSDK,
    }),
};

const controller = new UtilController({
    httpResponse,
    getImageKitTokenUseCase: useCases.getImageKitTokenUseCase,
});

const router = express.Router();

router.get(
    '/token-image-kit',
    authMiddleware,
    permissionRole([ROLE_ADMINISTRATOR, ROLE_PROVIDER]),
    async (req, res, next) => {
        try {
            await controller.getImageKitToken(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
