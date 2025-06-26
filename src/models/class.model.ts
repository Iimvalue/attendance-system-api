import { Schema, model, Types } from 'mongoose';


export interface ClassDocument {
  name: string;
  userId: Types.ObjectId; // this is for the user with role 'teacher' !!! very important 
  description: string;
  location: string;
  capacity: number;
  dateStartAt: Date;
  dateEndAt: Date;
  timeStartAt: number;
  timeEndAt: number;
  createdAt: Date;
  updatedAt: Date;
}

export const classSchema = new Schema<ClassDocument>({
     name: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users',
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
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
    },    timeStartAt: {
        type: Number,
        required: true,
        min: 0,
        max: 23,
    },
    timeEndAt: {
        type: Number,
        required: true,
        min: 0,
        max: 23,
    },
}, {
    timestamps: true,
});

classSchema.index({ userId: 1, _id: 1 }, { unique: true });

export const ClassCollection = model<ClassDocument>('Class', classSchema);

