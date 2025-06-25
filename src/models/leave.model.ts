import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILeave extends Document {
  classId: Types.ObjectId;
  studentId: Types.ObjectId;
  leavedAt: Date;
  leaveType: string;
  acceptedBy?: Types.ObjectId;
  acceptedAt?: Date;
  rejectedBy?: Types.ObjectId;
  rejectedAt?: Date;
}

const leaveSchema = new Schema<ILeave>({
  classId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Class' 
  },
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
  leavedAt: {
    type: Date,
    required: true
  },
  leaveType: {
    type: String,
    required: true,
    enum: ['sick', 'personal', 'emergency', 'vacation', 'other']
  },
  acceptedBy: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Users' 
  },
  acceptedAt: {
    type: Date,
    required: false
  },
  rejectedBy: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Users'
  },
  rejectedAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

leaveSchema.index({ classId: 1, studentId: 1, leavedAt: 1 });

export const Leave = mongoose.model<ILeave>('Leave', leaveSchema);