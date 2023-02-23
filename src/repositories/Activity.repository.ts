import { ClientSession } from 'mongoose';
import activityModel from '../models/activity.model';
import { ActivityInterface } from '../interface/activity.interface';
import logger from '../libraries/logger';

export default class ActivityRepository {
    async addActivity(payload: ActivityInterface, session: ClientSession) {
        try {
            return await session.withTransaction(async () => activityModel.create(payload));
        } catch (error) {
            logger.error(error);
            throw new Error('Error insert activity');
        }
    }

    async getActivity(payload: any) {
        try {
            return await activityModel.findOne(payload);
        } catch (error) {
            logger.error(error);
            return null;
        }
    }
}
