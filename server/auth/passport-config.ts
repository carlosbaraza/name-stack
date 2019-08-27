import passport from "passport";
import { User, IUser } from "../api/users/user-model";
import { localStrategy } from "./auth-local";
import { jwtStrategy } from "./auth-jwt";

passport.serializeUser(function(user: IUser, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(localStrategy);
passport.use(jwtStrategy);
