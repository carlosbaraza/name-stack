import HTTPStatus from "http-status";
import { RequestWithUser } from "../types";
import { ApolloServer, gql, ApolloServerExpressConfig } from "apollo-server-express";
import { ContextFunction } from "apollo-server-core";
import { Express } from "express";
import { typeDefs, resolvers } from "./schema";
import { authJwt } from "../auth/auth-jwt";
import { authLocal } from "../auth/auth-local";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    settings: {
      "request.credentials": "same-origin"
    }
  },
  context: context => {
    const req = context.req as RequestWithUser;
    const { user } = req;
    return { user };
  }
});

export function applyGraphQLMiddleware(app: Express) {
  const path = "/api/graphql";

  app.use(path, (req, res, next) => {
    // Allow GET (Playground)
    if (req.method === "GET") {
      return next();
    }
    // Authenticate other GraphQL queries
    if (req.headers.authorization) {
      return authJwt(req, res, next);
    } else if (req.user) {
      return next();
    } else {
      return res.status(HTTPStatus.UNAUTHORIZED).send();
    }
  });

  server.applyMiddleware({ app, path });
}
