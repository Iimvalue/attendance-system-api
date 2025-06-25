import { Request, Response } from "express"
import * as classService from "../services/class.service"
import {
  OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../utils/http-status"
import {AuthRequest} from "../middleware/auth.middleware"

export const createClass = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "admin") {
       res.status(BAD_REQUEST).json({
        status: "fail",
        message: "You do not have permission to create a class",
      })
      return
    }
    const {
      name,
      userId,
      description,
      location,
      capacity,
      dateStartAt,
      dateEndAt,
      timeStartAt,
      timeEndAt,
    } = req.body

    // the descritpion is unnecessary to be in condition because it's not important
    if (
      !name ||
      !userId ||
      !location ||
      !capacity ||
      !dateStartAt ||
      !dateEndAt ||
      timeStartAt === undefined ||
      timeEndAt === undefined
    ) {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "All fields are required",
      })
      return
    }

    if (new Date(dateStartAt) >= new Date(dateEndAt)) {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "End date must be after start date",
      })
      return
    }

    if (timeStartAt >= timeEndAt) {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "End time must be after start time",
      })
      return
    }

    const newClass = await ClassCollection.create({
      name,
      userId,
      description,
      location,
      capacity,
      dateStartAt: new Date(dateStartAt),
      dateEndAt: new Date(dateEndAt),
      timeStartAt,
      timeEndAt,
    } as any)

    res.status(CREATED).json({
      status: "success",
      message: "Class created successfully",
      data: { class: newClass },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const getAllClasses = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "principal") {
      res.status(BAD_REQUEST).json({
        status: "fail",
        message: "You do not have permission to view all classes",
      })
      return
    }
    const classes = await classService.getClassAll()
    const total = classes.length

    res.status(OK).json({
      status: "success",
      data: { classes, total },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}

export const getClassById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const classData = await classService.getClassById(id)
    
    res.status(OK).json({
      status: "success",
      data: { class: classData },
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

export const updateClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const updatedClass = await classService.updateClass(id, updateData)
    
    res.status(OK).json({
      status: "success",
      message: "Class updated successfully",
      data: { class: updatedClass },
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

export const deleteClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const deletedClass = await classService.deleteClass(id)
    
    res.status(OK).json({
      status: "success",
      message: "Class deleted successfully",
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

export const getClassesByTeacher = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { ClassCollection } = await import("../models/class.model")
    const classes = await ClassCollection.find({ userId })
      .populate('userId', 'email role')
      .sort({ createdAt: -1 })

    res.status(OK).json({
      status: "success",
      data: { classes },
    })
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Internal server error",
    })
  }
}
