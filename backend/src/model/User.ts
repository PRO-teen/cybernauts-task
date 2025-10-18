import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: Date;
  popularityScore: number;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  hobbies: {
    type: [String],
    required: true,
    default: [],
    set: (hobbies: string[]) =>
      hobbies.map(h => h.trim().toLowerCase()), // hobby normalization
  },
friends: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  popularityScore: { type: Number, default: 0 },
},
{ versionKey: false }
);

export const User = mongoose.model<IUser>("User", userSchema);
