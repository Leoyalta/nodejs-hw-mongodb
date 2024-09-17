import { Router } from "express";

import {
  getAllContactsController,
  getContactByIdController,
  addContactController,
  upsertContactController,
  updateContactController,
  deleteContactController,
} from "../controllers/contacts.js";

import ctrlWrapper from "../utils/crtlWrapper.js";
import validateBody from "../utils/validateBody.js";
import {
  addContactSchema,
  putchContactSchema,
} from "../validation/contacts.js";

import isValidId from "../middelwares/isValidId.js";

const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(getAllContactsController));

contactsRouter.get("/:id", isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post(
  "/",
  validateBody(addContactSchema),
  ctrlWrapper(addContactController)
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(addContactSchema),
  ctrlWrapper(upsertContactController)
);

contactsRouter.patch(
  "/:id",
  isValidId,
  validateBody(putchContactSchema),
  ctrlWrapper(updateContactController)
);

contactsRouter.delete("/:id", isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;
