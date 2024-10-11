import { Schema, model } from "mongoose";
import { contactType, emailRegexp } from "../../constants/contacts.js";
import { handleSaveError, setUpdateOptions } from "../hooks.js";

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
    photo: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", setUpdateOptions);
contactSchema.post("findOneAndUpdate", handleSaveError);

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
