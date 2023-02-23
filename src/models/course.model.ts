import { Schema, model } from 'mongoose';
import { CourseInterface } from '../interface/course.interface';

export const courseSchema = new Schema<CourseInterface>({
    name: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String, required: true },
    cover_image: { type: Schema.Types.String, required: true },
    keyword: { type: Schema.Types.String, required: false },
    modules: [{ type: Schema.Types.ObjectId, ref: 'modules', required: true }],
    is_active: { type: Schema.Types.Boolean, required: true, default: true },
    created_by: { type: Schema.Types.String, required: false },
    created_by_id: { type: Schema.Types.ObjectId, required: false, ref: 'user' },
});

export default model<CourseInterface>('courses', courseSchema);
