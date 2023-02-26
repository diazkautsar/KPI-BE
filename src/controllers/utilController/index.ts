import { Response, NextFunction } from 'express';

import HttpResponse from '../../libraries/HttpResponse';
import { CustomRequest } from '../../interface/request.interface';
import Utililty from '../../utilities';

import GetImageKitTokenUseCase from '../../useCases/utilUseCase/GetImageKitTokenUseCase';

type constructorType = {
    httpResponse: HttpResponse;
    getImageKitTokenUseCase: GetImageKitTokenUseCase;
};

export default class UtilController {
    httpResponse: HttpResponse;
    getImageKitTokenUseCase: GetImageKitTokenUseCase;

    constructor(args: constructorType) {
        this.httpResponse = args.httpResponse;
        this.getImageKitTokenUseCase = args.getImageKitTokenUseCase;
    }

    async getImageKitToken(req: CustomRequest, res: Response, next: NextFunction) {
        const response = await this.getImageKitTokenUseCase.exec();

        this.httpResponse.httpResponse(response, res);
    }
}
