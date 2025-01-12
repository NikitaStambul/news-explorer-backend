import mongoose, { Schema, Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  findUserByCredentials(email: string, password: string): Promise<IUser>;
}

const userSchema = new Schema<IUser, UserModel>({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: (props: { value: string }) =>
        `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function (
  email: string,
  password: string
): Promise<IUser> {
  const user = await this.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error(`There is no user with email: ${email}`);
    error.name = "CredentialsError";
    throw error;
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    const error = new Error("Incorrect password");
    error.name = "CredentialsError";
    throw error;
  }

  return user;
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
