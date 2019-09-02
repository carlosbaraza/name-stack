import { UNAUTHORIZED, CREATED, TEMPORARY_REDIRECT } from "http-status";
import { Router, Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

export const sessionRoutes = Router();

sessionRoutes.post("/", async (req, res, next) => {
  // Get the ID token passed and the CSRF token.
  const idToken = req.body.idToken.toString();

  //  TODO: CSRF
  //  const csrfToken = req.body.csrfToken.toString();
  //  Guard against CSRF attacks.
  //  if (csrfToken !== req.cookies.csrfToken) {
  //    res.status(401).send('UNAUTHORIZED REQUEST!');
  //    return;
  //  }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      sessionCookie => {
        // Set cookie policy for session cookie.
        const options = {
          maxAge: expiresIn,
          httpOnly: true,
          // Only make it secure in production, otherwise HTTPS is needed in development
          secure: process.env.NODE_ENV === "production"
        };
        res.cookie("session", sessionCookie, options);
        res.status(CREATED).json({ status: "success" });
      },
      error => {
        res.status(UNAUTHORIZED).json({ message: "Not authorized" });
      }
    );
});
