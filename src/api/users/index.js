import express from "express";
import { JWTAuthMiddleware } from "../../auth/JWTMiddleware.js";
import createError from "http-errors";
import { generateAccessToken } from "../../auth/tool.js";
import UserModel from "./model.js";


const usersRouter = express.Router();

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
    res.status(201).send({ _id });
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

      res.status(201).send();
    } else {
      next(createError(401, "Unauthorized"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.find({ username });
    if (user) {
      res.send(user);
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
      next(404, "User not found");
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
    res.clearCookie("accessToken", { path: "/" }).send();
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
