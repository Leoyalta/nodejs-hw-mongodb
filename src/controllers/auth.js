// import createHttpError from "http-errors";

import * as authServices from "../services/auth.js";
import { requestResetToken } from "../services/auth.js";
import { generateGoogleOAuthUrl } from "../utils/filters/GoogleOAuth2.js";
const setupSession = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });
};

export const registerController = async (req, res) => {
  const newUser = await authServices.register(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: newUser,
  });
};

export const loginController = async (req, res) => {
  const session = await authServices.login(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: "Successfully logged in an user!",
    date: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await authServices.refreshSession({
    refreshToken,
    sessionId,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: "Successfully refreshed a session!",
    date: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await authServices.logout(sessionId);
  }
  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");
  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: "Reset password email was successfully sent!",
    status: 200,
    data: {},
  });
};
export const requestSendEmailController = async (req, res) => {
  const { email } = req.body;
  await authServices.requestResetToken(email);

  res.send({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  const { password, token } = req.body;
  await authServices.resetPassword(password, token);

  res.json({
    message: "Password was successfully reset!",
    status: 200,
    data: {},
  });
};

export const getGoogleOauthUrlController = async (req, res) => {
  const url = generateGoogleOAuthUrl();

  res.json({
    status: 200,
    message: "Seccessfully created Google Oauth URL",
    data: { url },
  });
};

export const loginWhithGoogleOAuthUrlController = async (req, res) => {
  const session = await authServices.registerOrLoginWhithGoogleOAuth(
    req.body.code
  );
  setupSession(res, session);

  res.json({
    status: 200,
    message: "Successfully login by Google OAuth",
    data: {
      accessToken: session.accessToken,
    },
  });
};
