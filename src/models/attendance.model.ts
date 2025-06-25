import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface for the Attendance document
export interface IAttendance extends Document {
  classId: Types.ObjectId;
  attendeeId: Types.ObjectId;
  attenderId: Types.ObjectId;
  attendedAt: Date;
}

// Simple Attendance Schema
const attendanceSchema = new Schema<IAttendance>({
  classId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  attendeeId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  attenderId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  attendedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Export the model
export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);