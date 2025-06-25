import {
  EnrollmentCollection,
  EnrollmentDocument,
} from "../models/enrollment.model"
import { getClassCapacity } from "./class.service"
import { Types } from "mongoose"
import { ClassCollection } from "../models/class.model"

export type CreateEnrollmentInput = {
  classId: Types.ObjectId
  userId: Types.ObjectId
}

const enrollUser = async (enrollmentData: CreateEnrollmentInput) => {
  if (!enrollmentData.classId || !enrollmentData.userId) {
    throw new Error("Class ID and User ID are required")
  }

  const existingEnrollment = await EnrollmentCollection.findOne({
    classId: enrollmentData.classId,
    userId: enrollmentData.userId,
  })
  if (existingEnrollment) {
    throw new Error("User is already enrolled in this class")
  }

  const classCapacity = await getClassCapacity(
    enrollmentData.classId.toString()
  )
  const currentEnrollmentCount = await EnrollmentCollection.countDocuments({
    classId: enrollmentData.classId,
  })

  if (currentEnrollmentCount >= classCapacity) {
    throw new Error("Class is at full capacity")
  }

  const enrollment = await EnrollmentCollection.create(enrollmentData)
  return await EnrollmentCollection.findById(enrollment._id)
    .populate("userId", "email role")
    .populate("classId", "name")
}

const getEnrollmentsByClass = async (classId: string) => {
  const enrollments = await EnrollmentCollection.find({ classId }).populate(
    "userId",
    "email role"
  )
  return enrollments
}

const getEnrollmentsByUser = async (userId: string) => {
  const enrollments = await EnrollmentCollection.find({ userId })
    .populate("classId", "name description location")
    .sort({ createdAt: -1 })
  return enrollments
}

const getAllEnrollments = async () => {
  const enrollments = await EnrollmentCollection.find()
    .populate("userId", "email role")
    .populate("classId", "name")
    .sort({ createdAt: -1 })
  return enrollments
}

const getEnrollmentById = async (id: string) => {
  const enrollment = await EnrollmentCollection.findById(id)
    .populate("userId", "email role")
    .populate("classId", "name description location")

  if (!enrollment) {
    throw new Error(`enrollment with this id is not found`)
  }

  return enrollment
}

const updateEnrollment = async (
  id: string,
  updateData: Partial<EnrollmentDocument>
) => {
  const updatedEnrollment = await EnrollmentCollection.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  )
    .populate("userId", "email role")
    .populate("classId", "name description location")

  if (!updatedEnrollment) {
    throw new Error(`Enrollment with id ${id} not found`)
  }

  return updatedEnrollment
}

const deleteEnrollment = async (id: string) => {
  const deletedEnrollment = await EnrollmentCollection.findByIdAndDelete(id)
    .populate("userId", "email role")
    .populate("classId", "name")

  if (!deletedEnrollment) {
    throw new Error(`Enrollment with id ${id} not found`)
  }

  return deletedEnrollment
}

const getStudentsByTeacher = async (teacherId: string) => {
  const teacherClasses = await ClassCollection.find({ userId: teacherId })

  if (teacherClasses.length === 0) {
    return []
  }

  const classIds = teacherClasses.map((cls) => cls._id)

  const enrollments = await EnrollmentCollection.find({
    classId: { $in: classIds },
  })
    .populate("userId", "email role")
    .populate("classId", "name")
    .sort({ createdAt: -1 })

  return enrollments
}

const unenrollUser = async (classId: string, userId: string) => {
  const enrollment = await EnrollmentCollection.findOneAndDelete({
    classId,
    userId,
  })
    .populate("userId", "email role")
    .populate("classId", "name")

  if (!enrollment) {
    throw new Error("Enrollment not found")
  }

  return enrollment
}

const getEnrollmentCount = async (classId: string) => {
  return await EnrollmentCollection.countDocuments({ classId })
}

export {
  enrollUser,
  getEnrollmentsByClass,
  getEnrollmentsByUser,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
  getStudentsByTeacher,
  unenrollUser,
  getEnrollmentCount,
}
