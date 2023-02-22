import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export default class Jwt {
    async sign(data: {}) {
        return jwt.sign(data, env.SECRET_KEY);
    }

    async verify(token: string) {
        return jwt.verify(token, env.SECRET_KEY);
    }
}
