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

const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(getAllContactsController));

contactsRouter.get("/:id", ctrlWrapper(getContactByIdController));

contactsRouter.post("/", ctrlWrapper(addContactController));

contactsRouter.put("/:id", ctrlWrapper(upsertContactController));

contactsRouter.patch("/:id", ctrlWrapper(updateContactController));

contactsRouter.delete("/:id", ctrlWrapper(deleteContactController));

export default contactsRouter;
