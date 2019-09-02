import { Request } from "express";
import * as admin from "firebase-admin";

export interface Claims extends admin.auth.DecodedIdToken {
  role?: string;
}

export interface Request extends Request {
  claims: Claims;
}

export interface User extends admin.auth.UserRecord {
  customClaims?: {
    role: string;
  };
}
