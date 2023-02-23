import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import ActivityRepository from '../../repositories/Activity.repository';

import logger from '../../libraries/logger';

type constructorType = {
    activityRepository: ActivityRepository;
};

export default class GetActivityUseCase {
    activityRepository: ActivityRepository;

    constructor(args: constructorType) {
        this.activityRepository = args.activityRepository;
    }

    async exec(id: string[] | string | null | undefined, is_active: boolean = true): Promise<GREInterface> {
        const response = new GenericResponseEntity();
        try {
            const payload: { [K: string]: any } = {
                is_active,
            };

            if (Array.isArray(id) && id.length) {
                payload['_id'] = {
                    $in: id,
                };
            } else if (!Array.isArray(id) && id && id.length) {
                payload['_id'] = id;
            }

            response.success = true;
            response.statusCode = 200;
            response.message = 'Get Activity';
            response.messageTitle = 'Get Activity';
            response.data = await this.activityRepository.getActivity(payload);

            return response;
        } catch (error) {
            logger.error(error);
            response.success = false;
            response.statusCode = 500;
            response.messageTitle = 'Internal Server Error';
            response.message = 'internal server error';
        }

        return response;
    }
}
