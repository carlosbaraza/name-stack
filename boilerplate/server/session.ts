import mongoose from "mongoose";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import { JWT_SECRET } from "./constants";

const MongoStoreFactory = MongoStore(expressSession);

export function createSessionMiddleware() {
  const store = new MongoStoreFactory({ mongooseConnection: mongoose.connection });

  const session = expressSession({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store
  });

  return session;
}
