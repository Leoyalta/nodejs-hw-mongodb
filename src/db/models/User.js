import { Schema, model } from "mongoose";

import { emailRegexp } from "../../constants/contacts.js";

import { handleSaveError, setUpdateOptions } from "../hooks.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateOptions);
userSchema.post("findOneAndUpdate", handleSaveError);

const userCollection = model("user", userSchema);

export default userCollection;

// name - string, required
// email - string, email, unique, required
// password - string, required
// createdAt - дата створення
// updatedAt - дата оновлення
