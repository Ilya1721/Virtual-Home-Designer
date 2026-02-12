import mongoose, { Schema } from "mongoose";

export interface UserAuth {
  userId: Schema.Types.ObjectId;
  refreshToken: string;
  createdAt: Date;
}

const userAuthSchema = new mongoose.Schema<UserAuth>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  refreshToken: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export const UserAuthModel = mongoose.model("UserAuth", userAuthSchema);
