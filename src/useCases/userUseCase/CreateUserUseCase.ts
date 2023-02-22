import Validator from 'validatorjs';
import mongoose, { Connection } from 'mongoose';

import { GREInterface } from '../../interface/response.interface';
import { UserInterface } from '../../interface/user.interface';
import GenericResponseEntity from '../../entities/GenericResponseEntity';
import logger from '../../libraries/logger';
import Bcrypt from '../../libraries/Bcrypt';
import UserRoleRepository from '../../repositories/UserRole.repository';
import UserRepository from '../../repositories/User.repository';
import { ROLE_ADMINISTRATOR, ROLE_LEARNER, ROLE_PROVIDER } from '../../constants/index';

type constructorType = {
    userRoleRepository: UserRoleRepository;
    bcrypt: Bcrypt;
    userRepository: UserRepository;
    conn: Connection;
};

export default class CreateUserUseCase {
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

        const bodyReq = payload.body;
        const user = payload.user;

        const rules = {
            name: 'required|string',
            email: 'required|string',
            username: 'required|string',
            password: 'required|string',
            user_role: `required|in:${ROLE_LEARNER},${ROLE_PROVIDER}|string`,
        };

        const validator = new Validator(bodyReq, rules);
        if (!validator.check()) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Form Invalid';
            response.data = validator.errors.all();

            return response;
        }
        if (user.role_slug !== ROLE_ADMINISTRATOR) {
            response.statusCode = 400;
            response.success = false;
            response.messageTitle = 'Bad Request';
            response.message = "You're not eligible to create user";

            return response;
        }

        const session = await this.conn.startSession();

        try {
            const [basedOnUsername, basedOnEmail] = await Promise.all([
                await this.userRepository.getUserBasedOnPaylod({ username: bodyReq.username }),
                await this.userRepository.getUserBasedOnPaylod({ email: bodyReq.email }),
            ]);
            if (basedOnUsername || basedOnEmail) {
                session.endSession();
                response.statusCode = 400;
                response.success = false;
                response.messageTitle = 'Form Invalid';
                response.message = basedOnUsername ? 'Username already exist' : 'Email already exist';

                return response;
            }

            const validateRole = await this.userRoleRepository.getRoleBySlug(bodyReq.user_role);
            if (!validateRole) {
                session.endSession();
                response.statusCode = 400;
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
                created_by: user.name,
                created_by_id: user.id,
            };

            const inserted = await this.userRepository.addUser(payloadUser, session);

            session.endSession();

            response.success = true;
            response.statusCode = 201;
            response.messageTitle = 'Success create user';
            response.message = 'success create user';
            response.data = inserted ?? null;
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
