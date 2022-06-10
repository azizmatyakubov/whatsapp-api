 import {Profile, Strategy as GoogleStrategy, VerifyCallback} from "passport-google-oauth20";
import User from "../api/users/model";
import { generateAccessToken } from "./tool";
import dotenv from 'dotenv';

dotenv.config()

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    passReqToCallback: true,
  },

  async (
    req: Express.Request,
    accessToken: String,
    refreshToken: String,
    profile: Profile,
    done: VerifyCallback
  ) => {
    try {
       
      const user = {
        googleId: profile.id,
        username: profile.displayName,
        email : profile.emails?.values,
        avatar: profile.photos?.values,
      };

      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const newUser = new User(user);
        await newUser.save();
        const accessToken = await generateAccessToken({
          _id: newUser._id,
          username: "",
        });
        done(null, { accessToken });
      } else {
        const accessToken = await generateAccessToken({
          _id: existingUser._id,
          username: "",
        });
        done(null, { accessToken });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default googleStrategy;
