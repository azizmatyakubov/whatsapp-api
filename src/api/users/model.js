import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true  },
    avatar: { type: String, default: "https://picsum.photos/200/300" },
  },
  { timestamp: true }
);

UserSchema.pre("save", async function (next) {
  const newUser = this;
  const plainPW = newUser.password;
  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPW, 11);
    newUser.password = hash;
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

UserSchema.statics.checkCredentials = async function (email, plainPassword) {
  const user = await this.findOne({ email });

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

export default model("User", UserSchema);
