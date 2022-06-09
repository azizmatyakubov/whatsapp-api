import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../../types/Types";

const { Schema, model } = mongoose;


const UserSchema =
  new Schema <User, UserModel >
  ({
    username: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: false  },
    avatar: { type: String, default: "https://picsum.photos/200/300" },
    accessToken:{type:String},
    googleId: { type: String, default: null }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next: () => void) {
  const newUser = this as User;
  const plainPW = newUser.password;
  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPW as string|Buffer, 11);
    newUser.password = hash
  }
  next();
});

UserSchema.methods.toJSON = function () {
  const userDoc = this;
  const userObj = userDoc.toObject();

  delete userObj.password;
  delete userObj.__v;

  return userObj;
};

UserSchema.statics.checkCredentials = async function (phoneNumber: any, plainPassword: string | Buffer) {
  const user = await this.findOne({ phoneNumber });

  if (user) {
    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

interface UserModel extends mongoose.Model<User> {
  checkCredentials: (phoneNumber: string, password: string) => Promise<User | null>;
}

export default model<User, UserModel>("User", UserSchema);
