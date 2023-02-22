import { Types } from 'mongoose';

export interface UserInterface {
    name: string;
    email: string;
    username: string;
    password: string;
    user_role: Types.ObjectId;
    is_active?: boolean;
    is_blocked?: boolean;
    created_by?: string;
    created_by_id?: string;
}
