import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  email: string;
  password: string;
  comparePassword(userPassword: string): Promise<boolean>;
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
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  userPassword: string,
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

const User = model<IUser>("User", userSchema);

export default User;
