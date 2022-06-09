import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import validator from 'validator';
import passport from 'passport'

import { JWTAuthMiddleware } from "../../auth/JWTMiddleware";
import { generateAccessToken } from "../../auth/tool";

import UserSchema from "./model";
import { User } from "../../types/Types";


const usersRouter = express.Router();

usersRouter.get('/googleLogin', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

usersRouter.get('/googleRedirect', passport.authenticate('google', {session: false}), (req, res, next) => {
     // const accessToken = req.user?.accessToken;
    try {
     // res.redirect(`${process.env.FE_URL}/Chat/?accessToken=${accessToken}`);
    } catch (error) {
      
    }
})




usersRouter.post("/account",  async (req, res, next) => {
  try {

    // use validator
    // const { username, phoneNumber, password } = req.body;
    // if (!username || !phoneNumber || !password) {
    //   return next(createError(400, "Missing required fields"));
    // }
    // // check username
    // if( !validator.isAlphanumeric(username) || !validator.isMobilePhone(phoneNumber, 'any') || !validator.isLength(password, { min: 6, max: 20 })) {
    //   return next(createError(400, "Invalid username or phone number or password"));
    // }
   


    const newUser = new UserSchema(req.body);
    const { _id, username } = await newUser.save();
    const accessToken= await generateAccessToken({
      _id: _id,
      username: username,
    });
    
    res.status(201).send({_id, accessToken});
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/session", async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await UserSchema.checkCredentials(phoneNumber, password);
    if (user) {
      const accessToken =await generateAccessToken({
        _id: user._id,
        username: user.username,
      });
      let _id=user._id
      res.status(200).send( {_id, accessToken} );
    } else {
      next(createError(401, "Unauthorized"));
    }
  } catch (error) {
    next(error);
  }
});



usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const _id = req.user;
    const user = await UserSchema.findById(_id);

    if (user) {
      res.status(200).send(user);
    } else {
      next("User not found!");
    }
  } catch (error) {
    next(error);
  }
});



usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const auth  = req.headers.authorization;
    const accessToken = auth?.split(" ")[1];
    const user = await UserSchema.findById(accessToken);
    
    if (user) {
      res.send(user);
    } else {
      next(404);
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UserSchema.findByIdAndUpdate(
      req.user!,
      req.body,
      { new: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(404);
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/session", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
