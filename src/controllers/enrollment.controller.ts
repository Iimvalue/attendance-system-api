import { Response } from "express"
import * as enrollmentService from "../services/enrollment.service"
import {
  OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../utils/http-status"
import { AuthRequest } from "../middleware/auth.middleware"

export const createEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "admin") {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "You do not have permission to create an enrollment",
      })
      return
    }

    const { classId, userId } = req.body

    if (!classId || !userId) {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "All fields are required",
      })
      return
    }

    const newEnrollment = await enrollmentService.enrollUser({
      classId,
      userId,
    })

    res.status(CREATED).json({
      status: "success",
      message: "Enrollment created successfully",
      data: { enrollment: newEnrollment },
    })
  } catch (error: any) {
    if (error.message.includes('already enrolled') || error.message.includes('full capacity')) {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: error.message,
      })
    } else {
      res.status(INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error",
      })
    }
  }
}

export const getAllEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "admin") {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "You do not have permission to view all enrollments",
      })
      return
    }

    const enrollments = await enrollmentService.getAllEnrollments()
    const total = enrollments.length

    res.status(OK).json({
      status: "success",
      data: { enrollments, total },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const getEnrollmentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const enrollmentData = await enrollmentService.getEnrollmentById(id)

    res.status(OK).json({
      status: "success",
      data: { enrollment: enrollmentData },
    })
  } catch (error: any) {
    if (error.message.includes('not found')) {
      res.status(NOT_FOUND).json({
        status: "fail",
        message: error.message,
      })
    } else {
      res.status(INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error",
      })
    }
  }
}

export const updateEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "principal") {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "You do not have permission to update an enrollment",
      })
      return
    }
    const { id } = req.params
    const updateData = req.body

    const updatedEnrollment = await enrollmentService.updateEnrollment(id, updateData)

    res.status(OK).json({
      status: "success",
      message: "Enrollment updated successfully",
      data: { enrollment: updatedEnrollment },
    })
  } catch (error: any) {
    if (error.message.includes('not found')) {
      res.status(NOT_FOUND).json({
        status: "fail",
        message: error.message,
      })
    } else {
      res.status(INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error",
      })
    }
  }
}

export const deleteEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "admin" ) {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "You do not have permission to delete an enrollment",
      })
      return
    }
    const { id } = req.params
    const deletedEnrollment = await enrollmentService.deleteEnrollment(id)

    res.status(OK).json({
      status: "success",
      message: "Enrollment deleted successfully",
      data: { enrollment: deletedEnrollment },
    })
  } catch (error: any) {
    if (error.message.includes('not found')) {
      res.status(NOT_FOUND).json({
        status: "fail",
        message: error.message,
      })
    } else {
      res.status(INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error",
      })
    }
  }
}

export const getEnrollmentsByClass = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role === "student") {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "You do not have permission to view enrollments by class",
      })
      return
    }
    const { classId } = req.params
    const enrollments = await enrollmentService.getEnrollmentsByClass(classId)

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

export const getEnrollmentsByUser = async (req: AuthRequest, res: Response) => {
  try {
 
    const { userId } = req.params
    const enrollments = await enrollmentService.getEnrollmentsByUser(userId) 

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

export const getStudentsByTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { teacherId } = req.params
    const students = await enrollmentService.getStudentsByTeacher(teacherId)

    res.status(OK).json({
      status: "success",
      data: { students },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}


