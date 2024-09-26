import { Router } from "express";
import * as authControllers from "../controllers/auth.js";
import { userRegisterSchema, userLoginSchema } from "../validation/users.js";

import ctrlWrapper from "../utils/crtlWrapper.js";
import validateBody from "../utils/validateBody.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(userRegisterSchema),
  ctrlWrapper(authControllers.registerController)
);

authRouter.post(
  "/login",
  validateBody(userLoginSchema),
  ctrlWrapper(authControllers.loginController)
);

authRouter.post("/refresh", ctrlWrapper(authControllers.refreshController));

authRouter.post("/logout", ctrlWrapper(authControllers.logoutController));

export default authRouter;
