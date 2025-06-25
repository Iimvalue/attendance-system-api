import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: 'admin'|'principle'| 'teacher'| 'student';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
// note: I removed the 'id' field, we will use the default '_id' field. this is better for relationships and queries. 
// to know more search ObjectId vs id in mongoose 
const userSchema = new Schema<UserDocument>(
  { 
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['admin', 'principle', 'teacher', 'student'],
      default: 'student',
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret.id,
          email: ret.email,
          role: ret.role,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        }
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret.id,
          email: ret.email,
          role: ret.role,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        }
      },
    },
  }
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (error: any) {
    return next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export const UsersCollection = model<UserDocument>("Users", userSchema)
