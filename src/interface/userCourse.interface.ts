import { Types } from 'mongoose';

export interface UserCourseInterface {
    course_id: Types.ObjectId;
    users: Types.ObjectId[];
    start_date: Date;
    end_date: Date;
}
