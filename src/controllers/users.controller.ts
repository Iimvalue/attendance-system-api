import {
  OK,
  CREATED,
  BAD_REQUEST,
  FORBIDDEN,
  UNAUTHORIZED,
} from "../utils/http-status"
import { AuthRequest } from "../middleware/auth.middleware"
import { Request, Response, NextFunction } from "express"
import * as UserService from "../services/users.service"
import { AppError } from "../utils/error"

const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.role !== "admin") {
      {
        return next(
          new AppError(
            "You do not have permission to perform this action",
            UNAUTHORIZED
          )
        )
      }
    }

    const { email, password, role } = req.body

    // Check required fields
    if (!email) {
      res.status(BAD_REQUEST).json({
        status: "error",
        message: "Email is required",
      })
      return
    }

    if (!password) {
      res.status(BAD_REQUEST).json({
        status: "error",
        message: "Password is required",
      })
      return
    }

    if (!role) {
      res.status(BAD_REQUEST).json({
        status: "error",
        message: "Role is required",
      })
      return
    }

    const newUser = await UserService.createUser({
      email,
      password,
      role,
    })

    res.status(CREATED).json({
      status: "success",
      message: "User created successfully",
      //   data: newUser,
    })
  } catch (error) {
    next(error)
  }
}

const readUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserService.readUsers()

    res.status(OK).json({
      status: "success",
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

const readTeacherAndStudents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const teacherAndStudent = await UserService.readTeacherAndStudent()

    res.status(OK).json({
      status: "success",
      data: teacherAndStudent,
    })
  } catch (error) {
    next(error)
  }
}

const readUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id
    const user = await UserService.readUser(userId)

    res.status(OK).json({
      status: "success",
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id || req.user.id
    const { email, password, role } = req.body

    const updatedUser = await UserService.updateUser(userId, {
      email,
      password,
      role,
    })

    res.status(OK).json({
      status: "success",
      message: "User updated successfully",
      data: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteUser(req.user.id)

    res.cookie("accessToken", "none", {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    })

    res.cookie("refreshToken", "none", {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    })

    res.status(OK).json({
      status: "success",
      message: "Account deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

export {
  createUser,
  readUsers,
  readUser,
  updateUser,
  deleteUser,
  readTeacherAndStudents,
}
