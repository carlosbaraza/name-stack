import * as admin from "firebase-admin";
import { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } from "./constants";

import { Response, NextFunction } from "express";
import { Request } from "./types";
import { UNAUTHORIZED, TEMPORARY_REDIRECT } from "http-status";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    privateKey: FIREBASE_PRIVATE_KEY,
    clientEmail: FIREBASE_CLIENT_EMAIL
  })
});

export async function verifySession(
  session: string,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Verify the session cookie. In this case an additional check is added to detect
  // if the user's Firebase session was revoked, user deleted/disabled, etc.
  const decodedClaims = await admin.auth().verifySessionCookie(session, true /** checkRevoked */);

  req.claims = decodedClaims;

  next();
}

export async function verifySessionCookieNoErrorHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessionCookie = req.cookies.session || "";

  await verifySession(sessionCookie, req, res, next);
}

export async function verifySessionCookie(req: Request, res: Response, next: NextFunction) {
  try {
    await verifySessionCookieNoErrorHandler(req, res, next);
  } catch (e) {
    res.status(TEMPORARY_REDIRECT).redirect("/login");
  }
}
