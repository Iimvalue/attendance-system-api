import { EnrollmentCollection } from "../models/enrollment.model"
import { getClassCapacity } from "./class.service"
import { Types } from "mongoose"

export type CreateEnrollmentInput = {
  classId: Types.ObjectId
  userId: Types.ObjectId
}

// Enroll user in class
const enrollUser = async (enrollmentData: CreateEnrollmentInput) => {
  // first check class capacity
  const capacityCheck = await getClassCapacity(enrollmentData.classId.toString())

  if (capacityCheck <= 0) {
    throw new Error("Class is at full capacity")
  }

  // Check if user is already enrolled
  const existingEnrollment = await EnrollmentCollection.findOne({
    classId: enrollmentData.classId,
    userId: enrollmentData.userId,
  })
  if (existingEnrollment) {
    throw new Error("User is already enrolled in this class")
  }

  const enrollment = await EnrollmentCollection.create(enrollmentData)
  return enrollment
}

// Get all students for a class
const getEnrollmentsByClass = async (classId: string) => {
  const enrollments = await EnrollmentCollection.find({ classId }).populate("userId", "email role") 
  return enrollments
}

// Get all classes a user is enrolled in
const getEnrollmentsByUser = async (userId: string) => {
  const enrollments = await EnrollmentCollection.find({ userId }).populate("classId")
  return enrollments
}

// Unenroll user from class
const unenrollUser = async (classId: string, userId: string) => {
  return await EnrollmentCollection.findOneAndDelete({ classId, userId })
}

export { enrollUser, getEnrollmentsByClass, getEnrollmentsByUser, unenrollUser }
