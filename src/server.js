import express from "express";
import cors from "cors";
import logger from "./middelwares/logger.js";

import { env } from "./utils/env.js";

import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";

import notFoundHandler from "./middelwares/notFoundHandler.js";
import errorHandler from "./middelwares/errorHandler.js";
import cookieParser from "cookie-parser";
export const setupServer = () => {
  const app = express();

  app.use(logger);
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  //   routes
  app.use("/contacts", contactsRouter);
  app.use("/auth", authRouter);

  // middlewares
  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = Number(env("PORT", 3000));
  app.listen(port, console.log(`Server is running on port ${port}`));
};
