import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import { User, IUser } from "../api/users/user-model";
import { JWT_SECRET } from "../constants";

export const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload._id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  }
);

export const authJwt = passport.authenticate("jwt", { session: false });
