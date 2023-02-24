import Validator from 'validatorjs';
import { Connection, Types } from 'mongoose';

import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import ModuleRepository from '../../repositories/Module.repository';
import { ModuleInterface } from '../../interface/module.interface';
import ActivityRepository from '../../repositories/Activity.repository';

import logger from '../../libraries/logger';

type constructorType = {
    conn: Connection;
    moduleRepository: ModuleRepository;
    activityRepository: ActivityRepository;
};

export default class CreateModuelUseCase {
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

        const bodyReq = payload.body;
        const user = payload.user;

        const rules = {
            name: 'required|string',
            description: 'required|string',
            activities: 'required|array',
        };

        const validator = new Validator(bodyReq, rules);
        if (!validator.check()) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.data = validator.errors.all();

            return response;
        }

        // validate activity
        const { ObjectId } = Types;
        const idsActivity = bodyReq.activities;
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
        // end validate activity

        // validate exisiting module with same name
        const checkExisting = await this.moduleRepository.getModule({
            name: bodyReq.name,
        });
        if (Array.isArray(checkExisting) && checkExisting.length) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.message = 'module already exist';

            return response;
        }
        // end validate exisiting module with same name
        const session = await this.conn.startSession();

        try {
            const payloadModule: ModuleInterface = {
                name: bodyReq.name,
                description: bodyReq.description,
                activities: validIds,
                created_by: user.name,
                created_by_id: user.id,
            };

            const inserted = await this.moduleRepository.addModule(payloadModule, session);

            session.endSession();

            response.success = true;
            response.statusCode = 201;
            response.messageTitle = 'Success create module';
            response.message = 'success create module';
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
