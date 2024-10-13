import Joi from "joi";

import { emailRegexp } from "../constants/contacts.js";

export const userRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const requestSendEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export const resetPasswordShema = Joi.object({
  password: Joi.string().min(6).required(),
  token: Joi.string().required(),
});

export const userLogInWhithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});
