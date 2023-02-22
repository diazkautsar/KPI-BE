import { ClientSession } from 'mongoose';
import userModel from '../models/user.model';
import { UserInterface } from '../interface/user.interface';
import { UserRoleInterface } from '../interface/userRole.interface';

export default class UserRepository {
    async addUser(payload: UserInterface, session: ClientSession) {
        try {
            return await session.withTransaction(async () => await userModel.create(payload));
        } catch (error) {
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
            return null;
        }
    }
}
