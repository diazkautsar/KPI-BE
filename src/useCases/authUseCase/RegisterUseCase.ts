import Validator from 'validatorjs';
import { Connection } from 'mongoose';

import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import { UserInterface } from '../../interface/user.interface';
import Bcrypt from '../../libraries/Bcrypt';
import logger from '../../libraries/logger';
import UserRoleRepository from '../../repositories/UserRole.repository';
import UserRepository from '../../repositories/User.repository';
import { ROLE_ADMINISTRATOR } from '../../constants';

type constructorType = {
    userRoleRepository: UserRoleRepository;
    bcrypt: Bcrypt;
    userRepository: UserRepository;
    conn: Connection;
};

export default class RegisterUseCase {
    userRoleRepository: UserRoleRepository;
    bcrypt: Bcrypt;
    userRepository: UserRepository;
    conn: Connection;

    constructor(args: constructorType) {
        this.userRoleRepository = args.userRoleRepository;
        this.bcrypt = args.bcrypt;
        this.userRepository = args.userRepository;
        this.conn = args.conn;
    }

    async exec(payload: any): Promise<GREInterface> {
        const response = new GenericResponseEntity();

        const session = await this.conn.startSession();

        try {
            const bodyReq = payload?.body ?? {};

            const rules = {
                name: 'required|string',
                email: 'required|string',
                username: 'required|string',
                password: 'required|string',
                user_role: `required|in:${ROLE_ADMINISTRATOR}|string`,
            };

            const validator = new Validator(bodyReq, rules);

            if (!validator.check()) {
                session.endSession();
                response.success = false;
                response.messageTitle = 'Form Invalid';
                response.data = validator.errors.all();

                return response;
            }

            const validateRole = await this.userRoleRepository.getRoleBySlug(bodyReq.user_role);
            if (!validateRole) {
                session.endSession();
                response.success = false;
                response.messageTitle = 'Form Invalid';
                response.message = 'user role invalid';

                return response;
            }

            const hashPassword = await this.bcrypt.hashPassword(bodyReq.password);
            const payloadUser: UserInterface = {
                name: bodyReq.name,
                email: bodyReq.email,
                username: bodyReq.username,
                password: hashPassword,
                user_role: validateRole._id,
            };

            const user = await this.userRepository.addUser(payloadUser, session);

            session.endSession();

            response.success = true;
            response.messageTitle = 'Create user';
            response.message = 'Create user success';
            response.data = user ?? null;
        } catch (error) {
            session.endSession();
            logger.error(error);
            response.success = false;
            response.statusCode = 500;
            response.messageTitle = 'Internal Server Error';
            response.message = 'internal server error';
        }

        return response;
    }
}
