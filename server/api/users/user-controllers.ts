import HTTPStatus from "http-status";
import validate from "express-validation";
import { User } from "./user-model";
import { RequestWithUser } from "../../types";
import { Response } from "express";

export async function signUp(req: RequestWithUser, res: Response) {
  try {
    const user = await User.create(req.body);
    return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export function logIn(req: RequestWithUser, res: Response, next) {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  return next();
}

export function me(req: RequestWithUser, res: Response, next) {
  res.status(HTTPStatus.OK).json(req.user.toJSON());
  return next();
}

export function errorHandler(err: Error, req, res: Response, next) {
  console.log(err);
  if (process.env.NODE_ENV !== "production") {
    return res.status(500).json({ error: "Internal server error", stack: err.stack });
  } else {
    return res.status(500).json({ error: "Internal server error" });
  }
}
