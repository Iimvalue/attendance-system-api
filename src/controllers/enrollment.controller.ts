import { Request, Response } from "express"
import { EnrollmentCollection } from "../models/enrollment.model"
import {
  OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../utils/http-status"

export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const { classId, userId } = req.body

    if (!classId || !userId) {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "All fields are required",
      })
      return
    }

    const newEnrollment = await EnrollmentCollection.create({
      classId,
      userId,
    })

    res.status(CREATED).json({
      status: "success",
      message: "Enrollment created successfully",
      data: { enrollment: newEnrollment },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await EnrollmentCollection.find().sort({
      createdAt: -1,
    })
    const total = await EnrollmentCollection.countDocuments()

    res.status(OK).json({
      status: "success",
      data: { enrollments, total },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "internal server error",
    })
  }
}

export const getEnrollmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const enrollmentData = await EnrollmentCollection.findById(id)
    if (!enrollmentData) {
      res.status(NOT_FOUND).json({
        status: "fail",
        message: "Enrollment not found",
      })
      return
    }

    res.status(OK).json({
      status: "success",
      data: { enrollment: enrollmentData },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "internal server error",
    })
  }
}

export const updateEnrollment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const updatedEnrollment = await EnrollmentCollection.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    if (!updatedEnrollment) {
      res.status(NOT_FOUND).json({
        status: "fail",
        message: "Enrollment not found",
      })
      return
    }

    res.status(OK).json({
      status: "success",
      message: "enrollment updated successfully",
      data: { enrollment: updatedEnrollment },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "internal server error",
    })
  }
}

export const deleteEnrollment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deletedEnrollment = await EnrollmentCollection.findByIdAndDelete(id)
    if (!deletedEnrollment) {
      res.status(NOT_FOUND).json({
        status: "fail",
        message: "Enrollment not found",
      })
      return
    }

    res.status(OK).json({
      status: "success",
      message: "enrollment deleted successfully",
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "internal server error",
    })
  }
}

export const getEnrollmentsByClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params
    const enrollments = await EnrollmentCollection.find({ classId })
      .populate("userId") // later select relevant fields!!! Note to self
      .sort({ createdAt: -1 })

    res.status(OK).json({
      status: "success",
      data: { enrollments },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const getEnrollmentsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const enrollments = await EnrollmentCollection.find({ userId })
      .populate("classId", "name description location")
      .sort({ createdAt: -1 })

    res.status(OK).json({
      status: "success",
      data: { enrollments },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const getStudentsByTeacher = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.params

    const { ClassCollection } = await import("../models/class.model")
    const teacherClasses = await ClassCollection.find({ userId: teacherId })
    if (teacherClasses.length === 0) {
      res.status(OK).json({
        status: "success",
        data: { students: [] },
      })
      return
    }

    const classIds = teacherClasses.map((cls) => cls._id)

    const enrollments = await EnrollmentCollection.find({
      classId: { $in: classIds },
    })
      .populate("userId") // note to self : later select relevant fields!!!
      .populate("classId", "name")

    res.status(OK).json({
      status: "success",
      data: { students: enrollments },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
