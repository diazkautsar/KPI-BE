import { Types } from 'mongoose';

export interface ModuleInterface {
    name: string;
    description: string;
    activities: Types.ObjectId[];
    is_active?: boolean;
    created_by?: string;
    created_by_id?: string;
}
