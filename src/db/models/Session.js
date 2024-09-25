import { Schema, model } from "mongoose";

import { handleSaveError, setUpdateOptions } from "../hooks.js";

const sessionSchima = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

sessionSchima.post("save", handleSaveError);
sessionSchima.pre("findOneAndUpdate", setUpdateOptions);
sessionSchima.post("findOneAndUpdate", handleSaveError);

const SessionCollection = model("session", sessionSchima);

export default SessionCollection;
