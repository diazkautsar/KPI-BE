import { Response } from 'express';
import httpStatus from 'http-status';

import GenericResponseEntity from '../entities/GenericResponseEntity';
import { GREInterface } from '../interface/response.interface';

class HttpResponse {
    protected responseEntity;

    constructor() {
        this.responseEntity = GenericResponseEntity;
    }

    httpResponse(entity: GREInterface, res: Response) {
        if (!(entity instanceof this.responseEntity)) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
            return;
        }

        const response = entity.toResponse();
        res.status(response.statusCode).send(response);
    }
}

export default HttpResponse;
