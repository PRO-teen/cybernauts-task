import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRelationship extends Document {
  user1: Types.ObjectId;
  user2: Types.ObjectId;
  type: "friend" | "colleague" | "family";
  createdAt: Date;
}

const relationshipSchema = new Schema<IRelationship>(
  {
    user1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user2: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["friend", "colleague", "family"],
      default: "friend",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Unique pair index (A–B same as B–A)
relationshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

export const Relationship = mongoose.model<IRelationship>(
  "Relationship",
  relationshipSchema
);
