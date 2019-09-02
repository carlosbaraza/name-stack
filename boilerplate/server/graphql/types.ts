import { Context } from "apollo-server-core";
import { Request, Claims } from "../types";

export interface Context extends Context {
  claims: Claims;
}
