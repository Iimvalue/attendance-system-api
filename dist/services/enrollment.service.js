"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unenrollUser = exports.getEnrollmentsByUser = exports.getEnrollmentsByClass = exports.enrollUser = void 0;
const enrollment_model_1 = require("../models/enrollment.model");
const class_service_1 = require("./class.service");
// Enroll user in class
const enrollUser = async (enrollmentData) => {
    // first check class capacity
    const capacityCheck = await (0, class_service_1.getClassCapacity)(enrollmentData.classId.toString());
    if (capacityCheck <= 0) {
        throw new Error("Class is at full capacity");
    }
    // Check if user is already enrolled
    const existingEnrollment = await enrollment_model_1.EnrollmentCollection.findOne({
        classId: enrollmentData.classId,
        userId: enrollmentData.userId,
    });
    if (existingEnrollment) {
        throw new Error("User is already enrolled in this class");
    }
    const enrollment = await enrollment_model_1.EnrollmentCollection.create(enrollmentData);
    return enrollment;
};
exports.enrollUser = enrollUser;
// Get all students for a class
const getEnrollmentsByClass = async (classId) => {
    const enrollments = await enrollment_model_1.EnrollmentCollection.find({ classId }).populate("userId", "email role");
    return enrollments;
};
exports.getEnrollmentsByClass = getEnrollmentsByClass;
// Get all classes a user is enrolled in
const getEnrollmentsByUser = async (userId) => {
    const enrollments = await enrollment_model_1.EnrollmentCollection.find({ userId }).populate("classId");
    return enrollments;
};
exports.getEnrollmentsByUser = getEnrollmentsByUser;
// Unenroll user from class
const unenrollUser = async (classId, userId) => {
    return await enrollment_model_1.EnrollmentCollection.findOneAndDelete({ classId, userId });
};
exports.unenrollUser = unenrollUser;
