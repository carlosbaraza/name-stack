import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    currentUser: User
  }

  type Mutation {
    changeRole(uid: String, role: String): User
  }

  type User {
    uid: String
    email: String
    role: String
  }
`;
