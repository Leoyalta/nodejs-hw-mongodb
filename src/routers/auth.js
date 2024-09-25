import { Router } from "express";
import * as authControllers from "../controllers/auth.js";
import { userSignUpSchema, userSignInSchema } from "../validation/users.js";

import ctrlWrapper from "../utils/crtlWrapper.js";
import validateBody from "../utils/validateBody.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(userSignUpSchema),
  ctrlWrapper(authControllers.signupController)
);

authRouter.post(
  "/signin",
  validateBody(userSignInSchema),
  ctrlWrapper(authControllers.signinController)
);

authRouter.post("/refresh", ctrlWrapper(authControllers.refreshController));

authRouter.post("/logout", ctrlWrapper(authControllers.logoutController));

export default authRouter;
