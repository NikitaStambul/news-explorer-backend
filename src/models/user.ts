import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { IArticle } from "#types/newsapi";

export interface ISavedArticle extends IArticle {
  keyword: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bookmarked: ISavedArticle[];
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
  bookmarked: [
    {
      keyword: { type: String, default: null },
      source: {
        id: { type: String, default: null },
        name: { type: String, required: true },
      },
      author: { type: String, default: null },
      title: { type: String, required: true },
      description: { type: String, default: null },
      url: { type: String, required: true },
      urlToImage: { type: String, default: null },
      publishedAt: { type: String, required: true },
      content: { type: String, default: null },
    },
  ],
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
