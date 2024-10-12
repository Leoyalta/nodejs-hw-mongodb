import createHttpError from "http-errors";
import userCollection from "../db/models/User.js";
import SessionCollection from "../db/models/Session.js";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from "../constants/user.js";

import jwt from "jsonwebtoken";
// import { SMTP } from "../constants/index.js";
import { env } from "../utils/env.js";
import { sendEmail } from "../utils/sendMail.js";
import { createJwtToken } from "../utils/jwt.js";
import { TEMPLATES_DIR } from "../constants/index.js";

import { validateCode } from "../utils/filters/googleOAuth2.js";

import handlebars from "handlebars";
import path from "node:path";
import fs from "node:fs/promises";
const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifeTime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifeTime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, "Email already exists");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await userCollection.create({
    ...payload,
    password: hashPassword,
  });

  delete data._doc.password;
  return data._doc;
};

export const login = async (payload) => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, "Email or password is invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw createHttpError(401, "Email or password is invalid");
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });

  return userSession;
};

export const registerOrLoginWhithGoogleOAuth = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  let user = await userCollection.findOne({
    email: payload.email,
  });
  if (!user) {
    const password = randomBytes(10);
    const hashPassword = await bcrypt.hash(password, 10);
    user = await userCollection.create({
      email: payload.email,
      username: payload.name,
      password: hashPassword,
      verify: true,
    });

    delete user._doc.password;
  }
  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });

  return userSession;
};

export const findSessionByAccessToken = (accessToken) =>
  SessionCollection.findOne({ accessToken });

export const findUser = (filter) => userCollection.findOne(filter);

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!oldSession) {
    throw createHttpError(401, "Session not found");
  }

  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, "Session token expired");
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });

  return userSession;
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await userCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const resetToken = createJwtToken({ sub: user._id, email: user.email });

  const resetPasswordTemplatesPath = path.join(
    TEMPLATES_DIR,
    "reset-password-email.html"
  );

  const templateSource = await fs.readFile(resetPasswordTemplatesPath, "utf-8");

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env("APP_DOMAIN")}/reset-password?token=${resetToken}`,
  });

  const optionsEmail = {
    to: email,
    subject: "Reset your password",
    html,
  };

  try {
    await sendEmail(optionsEmail);
  } catch (err) {
    console.error("Error sending email:", err);
    throw createHttpError(
      500,
      "Failed to send the email, please try again later."
    );
  }
};

export const resetPassword = async (password, token) => {
  let entries;
  try {
    console.log("Received token:", token);
    entries = jwt.verify(token, env("JWT_SECRET"));

    const user = await userCollection.findOne({
      _id: entries.sub,
      email: entries.email,
    });
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await userCollection.findOneAndUpdate(
      { _id: user.id },
      { password: encryptedPassword }
    );
  } catch (error) {
    console.log("JWT Error:", error);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw createHttpError(401, "Token is expired or invalid.");
    }
    throw error;
  }
};
