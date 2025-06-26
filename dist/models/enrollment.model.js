"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentCollection = exports.enrollmentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.enrollmentSchema = new mongoose_1.Schema({
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Class",
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Users", // if the name of the collection in the database is changed , update this reference!!!!!
    },
}, {
    timestamps: true,
});
exports.enrollmentSchema.index({ classId: 1, userId: 1 }, { unique: true });
exports.EnrollmentCollection = (0, mongoose_1.model)("Enrollment", exports.enrollmentSchema);
