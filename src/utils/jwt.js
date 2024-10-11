import jwt from "jsonwebtoken";

import { env } from "./env.js";

const jwtSecret = env("JWT_SECRET");

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

export const createJwtToken = (payload) =>
  jwt.sign(payload, jwtSecret, { expiresIn: "5m" });
