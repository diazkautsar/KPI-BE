import { Types } from 'mongoose';

export interface CourseInterface {
    name: string;
    description: string;
    cover_image: string;
    modules: string[];
    keyword?: string;
    is_active?: boolean;
    created_by?: string;
    created_by_id?: string;
}
