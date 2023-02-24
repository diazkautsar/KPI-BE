import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import ActivityRepository from '../../repositories/Activity.repository';

import logger from '../../libraries/logger';
import { ActivityInterface } from '../../interface/activity.interface';

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

            const data = await this.activityRepository.getActivity(payload);

            response.success = true;
            response.statusCode = 200;
            response.message = 'Get Activity';
            response.messageTitle = 'Get Activity';
            response.data = await this.toResponse(data);

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

    async toResponse(data: [] | { [K: string]: any }[]): Promise<ActivityInterface[] | []> {
        return data.map((item: { [K: string]: any }) => ({
            id: item._id,
            name: item.name,
            description: item.description,
            media_type: item.media_type ?? null,
            media_url: item.media_url ?? null,
            is_active: item.is_active ?? null,
            created_by: item.created_by ?? null,
            created_by_id: item.created_by_id ?? null,
        }));
    }
}
