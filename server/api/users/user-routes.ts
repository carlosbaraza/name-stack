import { authJwt } from "../../auth/auth-jwt";
import { Router } from "express";
import validate from "express-validation";

import userValidation from "./user-validations";
import { authLocal } from "../../auth/auth-local";
import { checkAuthentication } from "../../auth/auth-helpers";
import { errorHandler, me, logIn, signUp } from "./user-controllers";

const routes = Router();

routes.post("/signup", validate(userValidation.signup), signUp);
routes.post("/login", authLocal, logIn);
routes.post("/me", authJwt, checkAuthentication, me);

routes.use(errorHandler);

export default routes;
