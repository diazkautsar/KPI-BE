import { Types } from 'mongoose';

export interface ActivityInterface {
    name: string;
    description: string;
    media_type?: string;
    media_url?: string;
    is_active?: boolean;
    created_by?: string;
    created_by_id?: string;
}
