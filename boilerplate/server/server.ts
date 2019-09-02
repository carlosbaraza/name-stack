require("dotenv").config();

import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import next from "next";
import { TEMPORARY_REDIRECT } from "http-status";

import "./database";
import { sessionRoutes } from "./api/session";
import { applyGraphQLMiddleware } from "./graphql";
import { verifySessionCookie } from "./firebase";

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(cookieParser());
  server.use(bodyParser());

  // REST API
  server.use("/api/v1/session", sessionRoutes);

  // GraphQL
  applyGraphQLMiddleware(server);

  // NextJS
  const nextMiddleware = (req, res) => {
    return handle(req, res);
  };

  // Public pages
  server.get("/login", nextMiddleware);
  server.get("/signup", nextMiddleware);
  server.get("/logout", (req, res, next) => {
    res.clearCookie("session");
    res.status(TEMPORARY_REDIRECT).redirect("/login");
  });
  server.get("/index", nextMiddleware);
  server.get("/_next/*", nextMiddleware);
  server.get("/static/*", nextMiddleware);

  // Authenticated pages
  server.get("*", verifySessionCookie, nextMiddleware);

  // Start server
  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
