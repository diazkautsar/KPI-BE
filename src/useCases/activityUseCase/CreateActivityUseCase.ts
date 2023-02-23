import Validator from 'validatorjs';
import { Connection } from 'mongoose';

import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import ActivityRepository from '../../repositories/Activity.repository';
import { ActivityInterface } from '../../interface/activity.interface';

import logger from '../../libraries/logger';

type constructorType = {
    conn: Connection;
    activityRepository: ActivityRepository;
};

export default class CreateActivityUseCase {
    conn: Connection;
    activityRepository: ActivityRepository;

    constructor(args: constructorType) {
        this.conn = args.conn;
        this.activityRepository = args.activityRepository;
    }

    async exec(payload: any): Promise<GREInterface> {
        const response = new GenericResponseEntity();

        const bodyReq = payload.body;
        const user = payload.user;

        const rules = {
            name: 'required|string',
            description: 'required|string',
            media_type: 'string',
            media_url: 'string',
        };

        const validator = new Validator(bodyReq, rules);
        if (!validator.check()) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.data = validator.errors.all();

            return response;
        }

        const checkExisting = await this.activityRepository.getActivity({
            name: bodyReq.name,
        });
        if (Array.isArray(checkExisting) && checkExisting.length) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.message = 'activity already exist';

            return response;
        }

        const session = await this.conn.startSession();

        try {
            const payloadActivity: ActivityInterface = {
                name: bodyReq.name,
                description: bodyReq.description,
                media_type: bodyReq.media_type,
                media_url: bodyReq.media_url,
                created_by: user.name,
                created_by_id: user.id,
            };

            const inserted = await this.activityRepository.addActivity(payloadActivity, session);

            session.endSession();

            response.success = true;
            response.statusCode = 201;
            response.messageTitle = 'Success create activity';
            response.message = 'success create activity';
            response.data = inserted ?? null;
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
