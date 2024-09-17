import { Schema, model } from "mongoose";
import { contactType, emailRegexp } from "../../constants/contacts.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactType,
      default: "personal",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const ContactCollection = model("Contact", contactSchema);

export const sortFields = [
  "name",
  "phoneNumber",
  "email",
  "isFavorite",
  "contactType",
  "createdAt",
  "updatedAt",
];

export default ContactCollection;
