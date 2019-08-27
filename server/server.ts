import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import next from "next";
import passport from "passport";
import userApiRoutes from "./api/users/user-routes";
import { checkAuthentication } from "./auth/auth-helpers";

import "./auth/passport-config";
import "./database";
import { applyGraphQLMiddleware } from "./graphql";
import { createSessionMiddleware } from "./session";

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(cookieParser());
  server.use(bodyParser());
  server.use(createSessionMiddleware());
  server.use(passport.initialize());
  server.use(passport.session());

  server.use("/api/v1/users", userApiRoutes);

  applyGraphQLMiddleware(server);

  const nextMiddleware = (req, res) => {
    return handle(req, res);
  };

  // Allow signin and signup
  server.get("/login", nextMiddleware);
  server.get("/signup", nextMiddleware);
  server.get("/_next/*", nextMiddleware);
  server.get("/static/*", nextMiddleware);

  // Authenticate the rest of pages
  server.get("*", checkAuthentication, nextMiddleware);

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
