import Validator from 'validatorjs';
import { Connection } from 'mongoose';

import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import ActivityRepository from '../../repositories/Activity.repository';

import logger from '../../libraries/logger';

type constructorType = {
    conn: Connection;
    activityRepository: ActivityRepository;
};

export default class UpdateActivityUseCase {
    conn: Connection;
    activityRepository: ActivityRepository;

    constructor(args: constructorType) {
        this.conn = args.conn;
        this.activityRepository = args.activityRepository;
    }

    async exec(payload: any): Promise<GREInterface> {
        const response = new GenericResponseEntity();

        const bodyReq = payload.body ?? null;

        if (Object.keys(bodyReq).length === 0) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.message = 'Body request required';

            return response;
        }

        const rules = {
            id: 'required|string',
            name: 'string',
            description: 'string',
            media_type: 'string',
            media_url: 'string',
            is_active: 'boolean',
        };

        const validator = new Validator(bodyReq, rules);
        if (!validator.check()) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.data = validator.errors.all();

            return response;
        }

        const session = await this.conn.startSession();

        try {
            const filter = { _id: bodyReq.id };
            const update = bodyReq;

            const updated = await this.activityRepository.updateActivity(filter, update, session);

            session.endSession();

            response.success = true;
            response.statusCode = 201;
            response.messageTitle = 'Success update activity';
            response.message = 'success update activity';
            response.data = updated ?? null;
        } catch (error) {
            session.endSession();
            logger.error(error);
            response.success = false;
            response.statusCode = 500;
            response.messageTitle = 'Internal Server Error';
            response.message = 'internal server error';
        }

        return response;
    }
}
