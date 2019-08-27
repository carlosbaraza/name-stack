import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";
import { hashSync, compareSync } from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

import { JWT_SECRET } from "../../constants";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required!"],
      trim: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        // @ts-ignore
        message: props => `${props.value} is not a valid email!`
      }
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      trim: true,
      minlength: [6, "Password need to be longer!"]
    }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!"
});

UserSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    this.password = this._hashPassword(this.password);
  }
  return next();
});

const methods = {
  _hashPassword(password: string) {
    return hashSync(password);
  },
  authenticateUser(password: string) {
    return compareSync(password, this.password);
  },
  createToken() {
    return jwt.sign(
      {
        _id: this._id
      },
      JWT_SECRET
    );
  },
  toAuthJSON() {
    return {
      _id: this._id,
      email: this.email,
      token: `JWT ${this.createToken()}`
    };
  },
  toJSON() {
    return {
      _id: this._id,
      email: this.email
    };
  }
};

UserSchema.methods = methods;

type TMethods = typeof methods;
export interface IUser extends Document, Omit<TMethods, "toJSON"> {
  email: string;
  password: string;
}

export const User = mongoose.model<IUser>("User", UserSchema);
