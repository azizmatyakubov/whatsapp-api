import express from "express";
import createError from "http-errors";
import passport from 'passport'
import { JWTAuthMiddleware } from "../../auth/JWTMiddleware.js";
import { generateAccessToken } from "../../auth/tool.js";
import UserModel from "./model.js";



const usersRouter = express.Router();

usersRouter.get('/googleLogin', passport.authenticate('google', {
    scope: ['profile', 'email']
    }))

usersRouter.get('/googleRedirect', passport.authenticate('google', {session: false}), (req, res, next) => {
    const accessToken = req.user.accessToken;
    try {
      res.redirect(`${process.env.FE_URL}/Chat/?accessToken=${accessToken}`);
    } catch (error) {
      
    }
})




usersRouter.post("/account", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id, username } = await newUser.save();
    const accessToken = await generateAccessToken({
      _id: _id,
      username: username,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res.status(201).send({accessToken});
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/session", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      const accessToken = await generateAccessToken({
        _id: user._id,
        username: user.username,
      });

      res.cookie({
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

      res.status(200).send({ accessToken });

    } else {
      next(createError(401, "Unauthorized"));
    }
  } catch (error) {
    next(error);
  }
});



usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await UserModel.findById(_id);
    
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
    const user = await UserModel.findById(req.user._id);
    if (user) {
      res.send(user);
    } else {
      next(404, "User not found");
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
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
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(404, "User Not Found");
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
