import HTTPStatus from "http-status";
import { Request } from "../types";
import { ApolloServer } from "apollo-server-express";
import { Express } from "express";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { verifySessionNoErrorHandler } from "../firebase";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    settings: {
      "request.credentials": "same-origin"
    }
  },
  context: context => {
    const req = context.req as Request;
    const { claims } = req;
    return { claims };
  }
});

export function applyGraphQLMiddleware(app: Express) {
  const path = "/api/graphql";

  app.use(path, async (req: Request, res, next) => {
    // Allow GET (Playground)
    if (req.method === "GET") {
      return next();
    }

    // Authenticate other GraphQL queries
    if (req.headers.authorization) {
      // TODO: Add middleware to authorize Firebase JWT Bearer tokens
      // return authJwt(req, res, next);
    } else {
      try {
        await verifySessionNoErrorHandler(req, res, next);
      } catch (e) {
        res.status(HTTPStatus.UNAUTHORIZED).json({ message: "Not authorized" });
      }
    }
  });

  server.applyMiddleware({ app, path });
}
