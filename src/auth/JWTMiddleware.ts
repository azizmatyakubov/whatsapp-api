import createError from "http-errors";
import { verifyAccessToken } from "./tool";
import  {RequestHandler, Request, Response, NextFunction } from "express";
import {User} from '../types/Types'

export const JWTAuthMiddleware= async (req:Request, res:Response, next:NextFunction) => {
  if (!req.headers.authorization) {
    next(createError(401, "Send Access Token"));
  } else {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const payload = await verifyAccessToken(token);

      req.user = payload._id;

      next();
    } catch (error) {
      next(createError(401, "Token Not Valid"));
    }
  }
};
