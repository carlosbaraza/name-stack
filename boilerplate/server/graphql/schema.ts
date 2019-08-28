import { Config, gql } from "apollo-server-express";
import { GraphQLFieldResolver } from "graphql";
import { Context } from "apollo-server-core";
import { IUser } from "../api/users/user-model";

export const typeDefs = gql`
  type Query {
    currentUser: User
  }

  type User {
    _id: String
    email: String
  }
`;

type CurrentUserResolver = GraphQLFieldResolver<any, Context<{ user: IUser }>, {}>;

const currentUser: CurrentUserResolver = (source, args, context) => {
  const { user } = context;
  return { _id: user._id, email: user.email };
};

export const resolvers: Config["resolvers"] = {
  Query: {
    currentUser
  }
};
