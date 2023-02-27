import { ClientSession } from 'mongoose';
import userCourseModel from '../models/userCourse.model';

import { UserCourseInterface } from '../interface/userCourse.interface';
import { CourseInterface } from '../interface/course.interface';
import { UserInterface } from '../interface/user.interface';

import logger from '../libraries/logger';

export default class UserCourseRepository {
    async addUserCourse(payload: UserCourseInterface, session: ClientSession) {
        try {
            return await session.withTransaction(async () => await userCourseModel.create(payload));
        } catch (error) {
            logger.error(error);
            throw new Error('Error insert user course');
        }
    }

    async getUserCourse(payload: any) {
        try {
            return await userCourseModel
                .find(payload)
                .populate<{ courses: CourseInterface; user: UserInterface }>('courses', 'user')
                .orFail()
                .exec();
        } catch (error) {
            logger.error(error);
            return [];
        }
    }

    async updateCourse(filter: { [K: string]: any }, update: { [K: string]: any }, session: ClientSession) {
        try {
            return await session.withTransaction(async () =>
                userCourseModel.findOneAndUpdate(filter, update, { new: true })
            );
        } catch (error) {
            logger.error(`Error update user courses ` + error);
            throw new Error(`Error update user courses ` + error);
        }
    }
}
