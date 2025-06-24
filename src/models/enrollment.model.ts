import { Schema, model, Types } from "mongoose"

export interface EnrollmentDocument {
  classId: Types.ObjectId
  userId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const enrollmentSchema = new Schema<EnrollmentDocument>(
  {  
    classId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Class",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users", // if the name of the collection in the database is changed , update this reference!!!!!
    },
  },
  {
    timestamps: true,
  }
)

enrollmentSchema.index({ classId: 1, userId: 1 }, { unique: true })

export const EnrollmentCollection = model<EnrollmentDocument>("Enrollment", enrollmentSchema)
