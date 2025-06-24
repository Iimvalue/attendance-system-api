import { Schema, model} from 'mongoose';
import {generateId} from '../utils/generate-id';


export interface ClassDocument {
  id: string;
  name: string;
  description: string;
  location: string;
  capacity: number;
  dateStartAt: Date;
  dateEndAt: Date;
  timeStartAt: number;
  timeEndAt: number;
}

export const classSchema = new Schema<ClassDocument>({
    id: {
        type: String,
        default: () => `class_${generateId()}`,
    },
    name: {
        type: String,
        required: true,
        trim: true,
}, description: {
        type: String,
        required: true,
        trim: true}
    ,
    location: {
        type: String,
        required: true,
        trim: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 10,
    },
    dateStartAt: {
        type: Date,
        required: true,
    },
    dateEndAt: {
        type: Date,
        required: true,
    },
    timeStartAt: {
        type: Number,
        required: true,
        min: 0,
        max: 24,
    },
    timeEndAt: {
        type: Number,
        required: true,
        min: 0,
        max: 24,
    },
}, {
    timestamps: true,
});

export const ClassCollection = model<ClassDocument>('Class', classSchema);

