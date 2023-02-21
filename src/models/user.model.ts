import { Schema, model } from 'mongoose';
import { UserInterface } from '../interface/user.interface';

export const userSchema = new Schema<UserInterface>({
    name: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true, unique: true },
    username: { type: Schema.Types.String, required: true, unique: true },
    password: { type: Schema.Types.String, required: true },
    user_role: { type: Schema.Types.ObjectId, required: true },
    is_active: { type: Schema.Types.Boolean, required: true, default: true },
    is_blocked: { type: Schema.Types.Boolean, required: true, default: false },
    created_by: { type: Schema.Types.String, required: false },
    created_id: { type: Schema.Types.ObjectId, required: false },
});

export default model<UserInterface>('user', userSchema, 'user');