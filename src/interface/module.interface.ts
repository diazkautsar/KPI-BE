import { Types } from 'mongoose';

export interface ModuleInterface {
    name: string;
    description: string;
    course: Types.ObjectId;
    cover_image?: string;
    keyword?: string;
    is_active?: boolean;
    created_by?: string;
    created_by_id?: string;
}
