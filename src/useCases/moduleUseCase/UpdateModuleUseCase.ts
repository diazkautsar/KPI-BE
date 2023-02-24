import Validator from 'validatorjs';
import { Connection, Types } from 'mongoose';

import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import ModuleRepository from '../../repositories/Module.repository';
import ActivityRepository from '../../repositories/Activity.repository';

import logger from '../../libraries/logger';

type constructorType = {
    conn: Connection;
    moduleRepository: ModuleRepository;
    activityRepository: ActivityRepository;
};

export default class UpdateModuleUseCase {
    conn: Connection;
    moduleRepository: ModuleRepository;
    activityRepository: ActivityRepository;

    constructor(args: constructorType) {
        this.conn = args.conn;
        this.moduleRepository = args.moduleRepository;
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
            activities: 'array',
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
            // validate activity
            const { ObjectId } = Types;
            const idsActivity = bodyReq.activities;
            if (Array.isArray(idsActivity) && idsActivity.length) {
                const validIds = idsActivity.filter((id: any) => ObjectId.isValid(id));
                const invalidIds = idsActivity.filter((id: any) => !ObjectId.isValid(id));

                if (invalidIds.length) {
                    response.statusCode = 400;
                    response.success = false;
                    response.messageTitle = 'Form Invalid';
                    response.message = `activity ${invalidIds.join(', ')} not found`;

                    return response;
                }

                const activities = await this.activityRepository.getActivity({
                    _id: {
                        $in: validIds,
                    },
                });

                if (activities.length && activities.length !== validIds.length) {
                    const activityIdNotFound: string[] = [];
                    validIds.forEach((element: string) => {
                        const idToFind = new ObjectId(element);
                        const dataDb = activities.find((item: any) => item._id.equals(idToFind));
                        if (!dataDb) {
                            activityIdNotFound.push(element);
                        }
                    });

                    response.statusCode = 400;
                    response.success = false;
                    response.messageTitle = 'Form Invalid';
                    response.message = `activity ${activityIdNotFound.join(', ')} not found`;

                    return response;
                }
            } else if (!Array.isArray(idsActivity) || (Array.isArray(idsActivity) && !idsActivity.length)) {
                bodyReq.activities = undefined;
            }
            // end validate activity

            const filter = { _id: bodyReq.id };
            const update = bodyReq;

            const updated = await this.moduleRepository.updateModule(filter, update, session);

            session.endSession();

            response.success = true;
            response.statusCode = 201;
            response.messageTitle = 'Success update module';
            response.message = 'success update module';
            response.data = updated ?? null;
        } catch (error) {
            console.log(error);
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
