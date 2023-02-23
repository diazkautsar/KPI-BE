import { Schema, model } from 'mongoose';
import { ModuleInterface } from '../interface/module.interface';

export const moduleSchema = new Schema<ModuleInterface>({
    name: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String, required: true },
    course: { type: Schema.Types.ObjectId, ref: 'courses', required: true },
    cover_image: { type: Schema.Types.String, required: false },
    keyword: { type: Schema.Types.String, required: false },
    is_active: { type: Schema.Types.Boolean, required: true, default: true },
    created_by: { type: Schema.Types.String, required: false },
    created_by_id: { type: Schema.Types.ObjectId, required: false, ref: 'user' },
});

export default model<ModuleInterface>('modules', moduleSchema);
