import jwt, { Secret } from "jsonwebtoken";
import { RequestHandler } from "express";
import { JwtPayload } from "../types/Types";


export const generateAccessToken = (payload: JwtPayload) =>{
return new Promise<string>((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET as Secret, {expiresIn: "1 week"},
      (err, token) => {
        if (err) reject(err);
        else{return resolve(token as string)};
      }
    )
  );}

export const verifyAccessToken = (token: string) =>
  new Promise<JwtPayload>((resolve, reject) =>
    jwt.verify(token as unknown as string, process.env.JWT_SECRET as Secret, (err, payload) => {
      if (err) reject(err);
      else resolve(payload as JwtPayload);
    })
  );
