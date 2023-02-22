import Validator from 'validatorjs';

import GenericResponseEntity from '../../entities/GenericResponseEntity';
import { GREInterface } from '../../interface/response.interface';
import logger from '../../libraries/logger';
import Bcrypt from '../../libraries/Bcrypt';
import Jwt from '../../libraries/Jwt';
import UserRepository from '../../repositories/User.repository';
import Utililty from '../../utilities';

type constructorType = {
    userRepository: UserRepository;
    bcrypt: Bcrypt;
    jwt: Jwt;
};

export default class LoginUseCase {
    userRepository: UserRepository;
    bcrypt: Bcrypt;
    jwt: Jwt;

    constructor(args: constructorType) {
        this.userRepository = args.userRepository;
        this.bcrypt = args.bcrypt;
        this.jwt = args.jwt;
    }

    async exec(payload: any): Promise<GREInterface> {
        const response = new GenericResponseEntity();

        try {
            const bodyReq = payload?.body ?? {};
            const rules = {
                username_email: 'required|string',
                password: 'required|string',
            };

            const validator = new Validator(bodyReq, rules);

            if (!validator.check()) {
                response.success = false;
                response.messageTitle = 'Form Invalid';
                response.data = validator.errors.all();

                return response;
            }

            const user = await this.userRepository.getUserBasedOnUsernameOrEmail(bodyReq.username_email);
            const isEmail = Utililty.checkEmailOrUsername(bodyReq.username_email);
            if (!user) {
                response.success = false;
                response.message = `Invalid ${isEmail ? 'email' : 'username'} or password`;
                response.messageTitle = 'Login Error';

                return response;
            }

            const comparePassword = await this.bcrypt.comparePassword(bodyReq.password, user.password);
            if (!comparePassword) {
                response.success = false;
                response.message = `Invalid ${isEmail ? 'email' : 'username'} or password`;
                response.messageTitle = 'Login Error';

                return response;
            }

            if (!user.is_active || user.is_blocked) {
                const message = !user.is_active
                    ? 'Sorry, your account is currently inactive. Please contact customer support for assistance.'
                    : 'Your account has been blocked. Please contact customer support for more information';
                response.success = false;
                response.message = message;
                response.messageTitle = 'Login Error';

                return response;
            }

            const data = {
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.user_role.title,
                is_active: user.is_active,
                is_blocked: user.is_blocked,
            };
            const access_token = await this.jwt.sign(data);
            response.success = true;
            response.statusCode = 200;
            response.message = 'login success';
            response.messageTitle = 'Login Success';
            response.data = {
                access_token,
                ...data,
            };
        } catch (error) {
            logger.error(error);
            response.success = false;
            response.statusCode = 500;
            response.messageTitle = 'Internal Server Error';
            response.message = 'internal server error';
        }

        return response;
    }
}
