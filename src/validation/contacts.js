import Joi from "joi";
import { emailRegexp } from "../constants/contacts.js";
import {
  contactType,
  //   yearOfBirthRegexp,
} from "../constants/contacts.js";

export const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(40).pattern(emailRegexp),
  isFavorite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...contactType)
    .required(),
  // yearOfBirth: Joi.string().pattern(yearOfBirthRegexp).required(),  // Валідація року народження
});

export const putchContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(6).max(20),
  email: Joi.string().pattern(emailRegexp),
  isFavorite: Joi.boolean(),
  contactType: Joi.string().valid(...contactType),
});
