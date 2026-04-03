import { model, Schema } from "mongoose";

interface IUser {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

const User = model<IUser>("User", userSchema);

export default User;
