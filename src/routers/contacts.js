import { Router } from "express";

import {
  getAllContactsController,
  getContactController,
  addContactController,
  upsertContactController,
  updateContactController,
  deleteContactController,
} from "../controllers/contacts.js";

import ctrlWrapper from "../utils/crtlWrapper.js";
import validateBody from "../utils/validateBody.js";
import authenticate from "../middelwares/authenticate.js";
import upload from "../middelwares/upload.js";

import {
  addContactSchema,
  putchContactSchema,
} from "../validation/contacts.js";

import isValidId from "../middelwares/isValidId.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", ctrlWrapper(getAllContactsController));

contactsRouter.get("/:id", isValidId, ctrlWrapper(getContactController));

contactsRouter.post(
  "/",
  // upload.fields([{name: "photo", maxCount: 2},{name: "logo", maxCount: 1},])
  // upload.array("photo", 8) // for multiple files
  upload.single("photo"),
  validateBody(addContactSchema),
  ctrlWrapper(addContactController)
);

contactsRouter.put(
  "/:id",
  upload.single("photo"),
  isValidId,
  validateBody(addContactSchema),
  ctrlWrapper(upsertContactController)
);

contactsRouter.patch(
  "/:id",
  upload.single("photo"),
  isValidId,
  validateBody(putchContactSchema),
  ctrlWrapper(updateContactController)
);

contactsRouter.delete("/:id", isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;
