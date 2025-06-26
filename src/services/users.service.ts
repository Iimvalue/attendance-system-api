import { AppError } from "../utils/error"
import { UsersCollection, UserDocument } from "../models/user.model"
import { NOT_FOUND, BAD_REQUEST } from "../utils/http-status"
import { AuthRequest } from "@/middleware/auth.middleware"

// Interface for creating a new user
interface CreateUserInput {
  email: string
  password: string
  role: "admin" | "principle" | "teacher" | "student"
}

// Interface for the response
interface CreateUserResponse {
  id: string
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
}

const createUser = async (
  userData: CreateUserInput
): Promise<CreateUserResponse> => {
  const { email, password, role } = userData

  // Check if user already exists
  const existingUser = await UsersCollection.findOne({ email })
  if (existingUser) {
    throw new AppError("User with this email already exists", BAD_REQUEST)
  }

  // Create new user
  const newUser = new UsersCollection({
    email,
    password, // Will be hashed automatically by the pre-save middleware
    role,
  })

  // Save the user with better error handling
  try {
    const savedUser = await newUser.save()

    // Return user data (password excluded by transform function)
    return {
      id: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    }
  } catch (saveError: any) {
    console.error("Save error details:", saveError)

    // Handle validation errors
    if (saveError.name === "ValidationError") {
      const errors = Object.values(saveError.errors).map(
        (err: any) => err.message
      )
      throw new AppError(`Validation failed: ${errors.join(", ")}`, BAD_REQUEST)
    }

    // Handle duplicate key errors
    if (saveError.code === 11000) {
      throw new AppError("User with this email already exists", BAD_REQUEST)
    }

    // Re-throw other errors
    throw new AppError("Failed to create user", 500)
  }
}

const readUsers = async (
  req: AuthRequest
): Promise<CreateUserResponse[]> => {
  const { role } = req.query;
  
  // Valid roles
  const validRoles = ['admin', 'principle', 'teacher', 'student'];
  
  // Build query object
  let query = {};
  
  // If role query parameter exists and is valid, filter by role
  if (role && typeof role === 'string' && validRoles.includes(role)) {
    query = { role: role };
  }
  // If no role specified, fetch all users (empty query object)
  
  const users = await UsersCollection.find(query);
  
  return users.map((user) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
};



const readUser = async (userId: string): Promise<CreateUserResponse> => {
  const user = await UsersCollection.findById(userId)
  if (!user) {
    throw new AppError("User not found", NOT_FOUND)
  }
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

// Interface for updating a user
interface UpdateUserInput {
  email?: string
  password?: string
  role?: "admin" | "principle" | "teacher" | "student"
}

const updateUser = async (
  userId: string,
  updateData: UpdateUserInput
): Promise<CreateUserResponse> => {
  const user = await UsersCollection.findById(userId)
  if (!user) {
    throw new AppError("User not found", NOT_FOUND)
  }

  // Check if email is being updated and if it already exists
  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await UsersCollection.findOne({
      email: updateData.email,
    })
    if (existingUser) {
      throw new AppError("User with this email already exists", BAD_REQUEST)
    }
  }

  // Update user fields
  if (updateData.email) user.email = updateData.email
  if (updateData.password) user.password = updateData.password // Will be hashed by pre-save middleware
  if (updateData.role) user.role = updateData.role

  // Save the updated user
  const updatedUser = await user.save()

  // Return updated user data
  return {
    id: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  }
}

const deleteUser = async (userId: string): Promise<void> => {
  const user = await UsersCollection.findById(userId)
  if (!user) {
    throw new AppError("User not found", NOT_FOUND)
  }
  await UsersCollection.findByIdAndDelete(userId)
}

export {
  createUser,
  readUsers,
  updateUser,
  deleteUser,
  readUser,
}
