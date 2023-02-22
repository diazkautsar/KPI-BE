import { ClientSession } from 'mongoose';
import userModel from '../models/user.model';
import { UserInterface } from '../interface/user.interface';
import { UserRoleInterface } from '../interface/userRole.interface';
import logger from '../libraries/logger';

export default class UserRepository {
    async addUser(payload: UserInterface, session: ClientSession) {
        try {
            return await session.withTransaction(async () => await userModel.create(payload));
        } catch (error) {
            logger.error(error);
            throw new Error('Error insert user');
        }
    }

    async getUserBasedOnUsernameOrEmail(usernameEmail: string) {
        try {
            return await userModel
                .findOne({
                    $or: [{ username: usernameEmail }, { email: usernameEmail }],
                })
                .populate<{ user_role: UserRoleInterface }>('user_role')
                .orFail()
                .exec();
        } catch (error) {
            logger.error(error);
            return null;
        }
    }

    async getUserBasedOnPaylod(payload: any) {
        try {
            return await userModel
                .findOne(payload)
                .populate<{ user_role: UserRoleInterface }>('user_role')
                .orFail()
                .exec();
        } catch (error) {
            logger.error(error);
            return null;
        }
    }

    async getUserBasedOnIds(ids: string[]) {
        try {
            return await userModel
                .find({
                    _id: {
                        $in: ids,
                    },
                })
                .populate<{ user_role: UserRoleInterface }>('user_role')
                .orFail()
                .exec();
        } catch (error) {
            logger.error(error);
            return [];
        }
    }
}
