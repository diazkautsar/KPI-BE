import { ClientSession } from 'mongoose';
import moduleModel from '../models/module.model';
import { ModuleInterface } from '../interface/module.interface';
import { ActivityInterface } from '../interface/activity.interface';
import logger from '../libraries/logger';

export default class ModuleRepository {
    async addModule(payload: ModuleInterface, session: ClientSession) {
        try {
            return await session.withTransaction(async () => moduleModel.create(payload));
        } catch (error) {
            logger.error(error);
            throw new Error('Error insert modul');
        }
    }

    async getModule(payload: any) {
        try {
            return await moduleModel
                .find(payload)
                .populate<{ activities: ActivityInterface }>('activities')
                .orFail()
                .exec();
        } catch (error) {
            logger.error(error);
            return [];
        }
    }

    async updateModule(filter: { [K: string]: any }, update: { [K: string]: any }, session: ClientSession) {
        try {
            return await session.withTransaction(async () =>
                moduleModel.findOneAndUpdate(filter, update, { new: true })
            );
        } catch (error) {
            logger.error(`Error update modul ` + error);
            throw new Error(`Error update modul ` + error);
        }
    }
}
