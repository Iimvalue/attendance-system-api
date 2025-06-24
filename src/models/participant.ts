import { Schema, model, Types } from "mongoose"
import { generateId } from "../utils/generate-id"

export interface ParticipantDocument {
  id: string
  classId: Types.ObjectId
  userId: Types.ObjectId
}

export const participantSchema = new Schema<ParticipantDocument>(
  {
    id: {
      type: String,
      default: () => `participant_${generateId()}`,
    },
    classId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Class",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
)

export const ParticipantCollection = model<ParticipantDocument>("Participant", participantSchema)