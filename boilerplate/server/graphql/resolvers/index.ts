import { Config } from "apollo-server-express";
import { changeRole } from "./change-role";
import { currentUser } from "./current-user";

export const resolvers: Config["resolvers"] = {
  Query: {
    currentUser
  },
  Mutation: {
    changeRole
  }
};
