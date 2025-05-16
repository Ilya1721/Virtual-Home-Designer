import { Schema, model } from "mongoose";
import { User } from "shared-types";

const userSchema = new Schema<User>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('id').get(function () {
  return this._id.toString();
});

export const UserModel = model<User>("User", userSchema);
