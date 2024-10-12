import { Router } from "express";
import * as authControllers from "../controllers/auth.js";
import {
  userRegisterSchema,
  userLoginSchema,
  requestSendEmailSchema,
  resetPasswordShema,
  userLogInWhithGoogleOAuthSchema,
} from "../validation/users.js";

import ctrlWrapper from "../utils/crtlWrapper.js";
import validateBody from "../utils/validateBody.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(userRegisterSchema),
  ctrlWrapper(authControllers.registerController)
);

authRouter.get(
  "/google-oauth-url",
  ctrlWrapper(authControllers.getGoogleOauthUrlController)
);

authRouter.post(
  "/confirm-google",
  validateBody(userLogInWhithGoogleOAuthSchema),
  authControllers.loginWhithGoogleOAuthUrlController
);

authRouter.post(
  "/login",
  validateBody(userLoginSchema),
  ctrlWrapper(authControllers.loginController)
);

authRouter.post("/refresh", ctrlWrapper(authControllers.refreshController));

authRouter.post("/logout", ctrlWrapper(authControllers.logoutController));

authRouter.post(
  "/send-reset-email",
  validateBody(requestSendEmailSchema),
  ctrlWrapper(authControllers.requestSendEmailController)
);

authRouter.post(
  "/reset-pwd",
  validateBody(resetPasswordShema),
  ctrlWrapper(authControllers.resetPasswordController)
);

export default authRouter;
