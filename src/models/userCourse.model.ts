import { Schema, model } from 'mongoose';
import { UserCourseInterface } from '../interface/userCourse.interface';

export const userCourseSchema = new Schema<UserCourseInterface>({
    course_id: { type: Schema.Types.ObjectId, required: true, ref: 'courses' },
    users: [{ type: Schema.Types.ObjectId, required: true, ref: 'user' }],
    start_date: { type: Schema.Types.Date, required: true },
    end_date: { type: Schema.Types.Date, required: true },
});

export default model<UserCourseInterface>('user_courses', userCourseSchema);
