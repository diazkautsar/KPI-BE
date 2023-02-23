import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomJwtPayload } from 'src/interface/jwt.interface';
import { env } from '../config/env';

export default class Jwt {
    async sign(data: {}) {
        return jwt.sign(data, env.SECRET_KEY);
    }

    async verify(token: string): Promise<CustomJwtPayload | null> {
        try {
            const verify = jwt.verify(token, env.SECRET_KEY) as JwtPayload;
            const customPayload: CustomJwtPayload = {
                ...verify,
                id: verify.id,
                name: verify.name,
                username: verify.username,
                email: verify.email,
                role: verify.role,
                role_slug: verify.role_slug,
                is_active: verify.is_active,
                is_blocked: verify.is_blocked,
            };

            return customPayload;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
