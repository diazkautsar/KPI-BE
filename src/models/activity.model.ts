import { Schema, model } from 'mongoose';
import { ActivityInterface } from '../interface/activity.interface';

export const activitySchema = new Schema<ActivityInterface>({
    name: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String, required: true },
    media_type: { type: Schema.Types.String, required: false },
    media_url: { type: Schema.Types.String, required: false },
    is_active: { type: Schema.Types.Boolean, required: true, default: true },
    created_by: { type: Schema.Types.String, required: false },
    created_by_id: { type: Schema.Types.ObjectId, required: false, ref: 'user' },
});

export default model<ActivityInterface>('activities', activitySchema);
