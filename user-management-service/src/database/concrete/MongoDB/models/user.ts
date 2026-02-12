import { Schema, model } from "mongoose";
import { User, UserRole } from "shared-types";

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true
    },
    createdAt: { type: Date, default: Date.now }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const UserModel = model<User>("User", userSchema);
