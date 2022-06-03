import createError from "https-errors";
import { verifyAccessToken } from "./tool.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    next(createError(401, "Send Access Token"));
  } else {
    try {
      const token = req.cookies.accessToken;
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
