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
exports.Leave = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const leaveSchema = new mongoose_1.Schema({
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Class'
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'Users'
    },
    acceptedAt: {
        type: Date,
        required: false
    },
    rejectedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.Leave = mongoose_1.default.model('Leave', leaveSchema);
