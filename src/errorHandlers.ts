import { ErrorRequestHandler } from "express";

export const badRequestErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.status === 400) {
      res.status(400).send({ message: err.message });
    } else {
      next(err);
    }
  };
  
  export const unauthorizedErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.status === 401) {
      res.status(401).send({ message: "Unauthorized!" });
    } else {
      next(err);
    }
  };
  
  export const notFoundErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.status === 404) {
      res.status(404).send({ message: err.message || "Not found!" });
    } else {
      next(err);
    }
  };
  
  export const genericErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: "Generic Server Error!!" });
  };