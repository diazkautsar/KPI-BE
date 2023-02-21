import bcrypt from 'bcrypt';
import { env } from '../config/env';

export default class Bcrypt {
    async hashPassword(plainPassword: string) {
        return bcrypt.hashSync(plainPassword, parseInt(env.SALT_ROUNDS));
    }

    async comparePassword(plainPassword: string, hashPassword: string) {
        return bcrypt.compareSync(plainPassword, hashPassword);
    }
}
