"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceCollection = exports.AttendanceStatus = void 0;
exports.createAttendanceRecord = createAttendanceRecord;
const mongoose_1 = __importStar(require("mongoose"));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "present";
    AttendanceStatus["ABSENT"] = "absent";
    AttendanceStatus["LATE"] = "late";
    AttendanceStatus["EXCUSED"] = "excused";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
// Simplified Attendance Schema
const attendanceSchema = new mongoose_1.Schema({
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
        index: true,
    },
    attendeeId: {
        type: mongoose_1.Schema.Types.ObjectId, // Changed to ObjectId
        ref: 'Users', // Matching your User collection name
        required: true,
        index: true,
    },
    attenderId: {
        type: mongoose_1.Schema.Types.ObjectId, // Changed to ObjectId
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
            };
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
            };
        },
    },
});
// Compound indexes for better query performance
attendanceSchema.index({ classId: 1, attendeeAt: -1 });
attendanceSchema.index({ attendeeId: 1, attendeeAt: -1 });
attendanceSchema.index({ classId: 1, attendeeId: 1, attendeeAt: -1 });
// Static methods for common queries
attendanceSchema.statics.getClassAttendance = function (classId, date) {
    const query = { classId };
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
attendanceSchema.statics.getStudentAttendance = function (studentId, // Changed to ObjectId
classId, startDate, endDate) {
    const query = {
        attendeeId: studentId
    };
    if (classId)
        query.classId = classId;
    if (startDate || endDate) {
        query.attendeeAt = {};
        if (startDate)
            query.attendeeAt.$gte = startDate;
        if (endDate)
            query.attendeeAt.$lte = endDate;
    }
    return this.find(query);
};
// Export the model
exports.AttendanceCollection = mongoose_1.default.model('Attendance', attendanceSchema);
// Helper function to create attendance record
async function createAttendanceRecord({ classId, attendeeId, attenderId, status = AttendanceStatus.PRESENT, attendeeAt = new Date() }) {
    // Check if attendance already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const existingAttendance = await exports.AttendanceCollection.findOne({
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
    const attendance = new exports.AttendanceCollection({
        classId,
        attendeeId,
        attenderId,
        status,
        attendeeAt
    });
    return await attendance.save();
}
