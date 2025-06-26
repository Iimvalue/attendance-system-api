"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassCollection = exports.classSchema = void 0;
const mongoose_1 = require("mongoose");
exports.classSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    }, timeStartAt: {
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
exports.classSchema.index({ userId: 1, _id: 1 }, { unique: true });
exports.ClassCollection = (0, mongoose_1.model)('Class', exports.classSchema);
