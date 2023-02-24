import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import ModuleRepository from '../../repositories/Module.repository';

import logger from '../../libraries/logger';
import { ModuleInterface } from '../../interface/module.interface';

type constructorType = {
    moduleRepository: ModuleRepository;
};

export default class GetModuleUseCase {
    moduleRepository: ModuleRepository;

    constructor(args: constructorType) {
        this.moduleRepository = args.moduleRepository;
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

            const data = await this.moduleRepository.getModule(payload);

            response.success = true;
            response.statusCode = 200;
            response.message = 'Get Module';
            response.messageTitle = 'Get Module';
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

    async toResponse(data: [] | { [K: string]: any }[]): Promise<ModuleInterface[] | []> {
        return data.map((item: { [K: string]: any }) => ({
            id: item._id,
            name: item.name,
            description: item.description,
            activities: item.activities,
            is_active: item.is_active ?? null,
            created_by: item.created_by ?? null,
            created_by_id: item.created_by_id ?? null,
        }));
    }
}
