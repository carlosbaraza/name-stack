import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../api/users/user-model";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "email"
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false);
      } else if (!user.authenticateUser(password)) {
        return done(null, false);
      }

      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  }
);

export const authLocal = passport.authenticate("local", { session: true });
