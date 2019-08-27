import { Request } from "express";
import { IUser } from "./api/users/user-model";

export interface RequestWithUser extends Request {
  user: IUser;
}
