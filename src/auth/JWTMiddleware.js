import createError from "http-errors";
import { verifyAccessToken } from "./tool.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createError(401, "Send Access Token"));
  } else {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const payload = await verifyAccessToken(token);

      req.user = {
        _id: payload._id,
        username: payload.username,
      };
      next();
    } catch (error) {
      next(createError(401, "Token Not Valid"));
    }
  }
};
