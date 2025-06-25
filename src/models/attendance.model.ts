import mongoose, { Document, Schema, Types } from 'mongoose';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused'
}

// Interface for the Attendance document
export interface IAttendance extends Document {
  _id: Types.ObjectId; // Using default MongoDB _id
  classId: Types.ObjectId;
  attendeeId: Types.ObjectId; // Changed to ObjectId to match User model
  attenderId: Types.ObjectId; // Changed to ObjectId to match User model
  status: AttendanceStatus;
  attendeeAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Simplified Attendance Schema
const attendanceSchema = new Schema<IAttendance>({
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true,
  },
  attendeeId: {
    type: Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'Users', // Matching your User collection name
    required: true,
    index: true,
  },
  attenderId: {
    type: Schema.Types.ObjectId, // Changed to ObjectId
    ref: 'Users', // Matching your User collection name
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: Object.values(AttendanceStatus),
    default: AttendanceStatus.PRESENT,
    required: true
  },
  attendeeAt: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      return {
        id: ret._id, // Convert _id to id for frontend consistency
        classId: ret.classId,
        attendeeId: ret.attendeeId,
        attenderId: ret.attenderId,
        status: ret.status,
        attendeeAt: ret.attendeeAt,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
      }
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      return {
        id: ret._id, // Convert _id to id for frontend consistency
        classId: ret.classId,
        attendeeId: ret.attendeeId,
        attenderId: ret.attenderId,
        status: ret.status,
        attendeeAt: ret.attendeeAt,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
      }
    },
  },
});

// Compound indexes for better query performance
attendanceSchema.index({ classId: 1, attendeeAt: -1 });
attendanceSchema.index({ attendeeId: 1, attendeeAt: -1 });
attendanceSchema.index({ classId: 1, attendeeId: 1, attendeeAt: -1 });

// Static methods for common queries
attendanceSchema.statics.getClassAttendance = function(classId: Types.ObjectId, date?: Date) {
  const query: any = { classId };
  
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    query.attendeeAt = {
      $gte: startOfDay,
      $lte: endOfDay
    };
  }
  
  return this.find(query).sort({ attendeeAt: -1 });
};

attendanceSchema.statics.getStudentAttendance = function(
  studentId: Types.ObjectId, // Changed to ObjectId
  classId?: Types.ObjectId,
  startDate?: Date,
  endDate?: Date
) {
  const query: any = { 
    attendeeId: studentId
  };
  
  if (classId) query.classId = classId;
  
  if (startDate || endDate) {
    query.attendeeAt = {};
    if (startDate) query.attendeeAt.$gte = startDate;
    if (endDate) query.attendeeAt.$lte = endDate;
  }
  
  return this.find(query);
};

// Export the model
export const AttendanceCollection = mongoose.model<IAttendance>('Attendance', attendanceSchema);

// Helper function to create attendance record
export async function createAttendanceRecord({
  classId,
  attendeeId,
  attenderId,
  status = AttendanceStatus.PRESENT,
  attendeeAt = new Date()
}: {
  classId: Types.ObjectId;
  attendeeId: Types.ObjectId; // Changed to ObjectId
  attenderId: Types.ObjectId; // Changed to ObjectId
  status?: AttendanceStatus;
  attendeeAt?: Date;
}): Promise<IAttendance> {
  
  // Check if attendance already exists for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const existingAttendance = await AttendanceCollection.findOne({
    classId,
    attendeeId,
    attendeeAt: {
      $gte: today,
      $lt: tomorrow
    }
  });
  
  if (existingAttendance) {
    throw new Error('Attendance already marked for today');
  }
  
  const attendance = new AttendanceCollection({
    classId,
    attendeeId,
    attenderId,
    status,
    attendeeAt
  });
  
  return await attendance.save();
}
