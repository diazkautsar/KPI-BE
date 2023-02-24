import { ClientSession } from 'mongoose';
import courseModel from '../models/course.model';
import { CourseInterface } from '../interface/course.interface';
import { ModuleInterface } from '../interface/module.interface';
import logger from '../libraries/logger';

export default class CourseRepository {
    async addCourse(payload: CourseInterface, session: ClientSession) {
        try {
            return await session.withTransaction(async () => courseModel.create(payload));
        } catch (error) {
            logger.error(error);
            throw new Error('Error insert course');
        }
    }

    async getCourse(payload: any) {
        try {
            return await courseModel.find(payload).populate<{ modules: ModuleInterface }>('modules').orFail().exec();
        } catch (error) {
            logger.error(error);
            return [];
        }
    }

    async updateCourse(filter: { [K: string]: any }, update: { [K: string]: any }, session: ClientSession) {
        try {
            return await session.withTransaction(async () =>
                courseModel.findOneAndUpdate(filter, update, { new: true })
            );
        } catch (error) {
            logger.error(`Error update courses ` + error);
            throw new Error(`Error update courses ` + error);
        }
    }
}
