import { Context } from "../types";
import { GraphQLFieldResolver } from "graphql";

type CurrentUserResolver = GraphQLFieldResolver<any, Context, {}>;

export const currentUser: CurrentUserResolver = (source, args, context) => {
  const { claims } = context;
  return {
    uid: claims.uid,
    email: claims.email,
    role: claims.role
  };
};
