import { ClientSession } from 'mongoose';
import userModel from '../models/user.model';
import { UserInterface } from '../interface/user.interface';

export default class UserRepository {
    async addUser(payload: UserInterface, session: ClientSession) {
        try {
            return await session.withTransaction(async () => await userModel.create(payload));
        } catch (error) {
            throw new Error('Error insert user');
        }
    }
}
