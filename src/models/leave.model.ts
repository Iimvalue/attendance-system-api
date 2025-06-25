import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface for the Leave document
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

// Simple Leave Schema
const leaveSchema = new Schema<ILeave>({
  classId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  leavedAt: {
    type: Date,
    required: true
  },
  leaveType: {
    type: String,
    required: true
  },
  acceptedBy: {
    type: Schema.Types.ObjectId,
    required: false
  },
  acceptedAt: {
    type: Date,
    required: false
  },
  rejectedBy: {
    type: Schema.Types.ObjectId,
    required: false
  },
  rejectedAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Export the model
export const Leave = mongoose.model<ILeave>('Leave', leaveSchema);