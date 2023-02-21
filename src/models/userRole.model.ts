import { Schema, model } from 'mongoose';

import { UserRoleInterface } from '../interface/userRole.interface';

export const userRoleSchema = new Schema<UserRoleInterface>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
});

export default model<UserRoleInterface>('user_role', userRoleSchema, 'user_role');
