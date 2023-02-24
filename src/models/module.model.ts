import { Schema, model } from 'mongoose';
import { ModuleInterface } from '../interface/module.interface';

export const moduleSchema = new Schema<ModuleInterface>({
    name: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String, required: true },
    activities: [{ type: Schema.Types.ObjectId, ref: 'activities', required: true }],
    is_active: { type: Schema.Types.Boolean, required: true, default: true },
    created_by: { type: Schema.Types.String, required: false },
    created_by_id: { type: Schema.Types.ObjectId, required: false, ref: 'user' },
});

export default model<ModuleInterface>('modules', moduleSchema);
