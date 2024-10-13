import * as contactServices from "../services/contacts.js";
import createHttpError from "http-errors";
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseSortParams from "../utils/parseSortParams.js";
import { sortFields } from "../db/models/contact.js";
import parseContactFilterParams from "../utils/filters/parseContactFilterParams.js";
import saveFileToUploadDir from "../utils/filters/saveFileToUploadDir.js";
import saveFileToCloudinary from "../utils/filters/saveFileToCloudinary.js";
import { env } from "../utils/env.js";

const enableCloudinary = env("ENABLE_CLOUDINARY");
export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });
  const filter = parseContactFilterParams(req.query);
  const { _id: userId } = req.user;

  const data = await contactServices.getContacts({
    perPage,
    page,
    sortBy,
    sortOrder,
    filter: { ...filter, userId },
  });
  res.json({
    status: 200,
    message: "Succesfuiily found contacts",
    data,
  });
};
export const getContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const data = await contactServices.getContact({ id, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id = ${id} is not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  let photo;

  if (req.file) {
    if (enableCloudinary === "true") {
      photo = await saveFileToCloudinary(req.file, "photos");
    } else {
      photo = await saveFileToUploadDir(req.file);
    }
  }
  // console.log(req.body);
  // console.log(req.file);
  // console.log(req.files); //for more than 1 file

  const { _id: userId } = req.user;
  const data = await contactServices.addContact({ ...req.body, userId, photo });
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  let photo;

  if (req.file) {
    if (enableCloudinary === "true") {
      photo = await saveFileToCloudinary(req.file, "photos");
    } else {
      photo = await saveFileToUploadDir(req.file);
    }
  }

  const { isNew, data } = await contactServices.updateContact(
    { _id: id, userId },
    { ...req.body, photo }, // Додаємо поле photo до даних для оновлення
    {
      upsert: true,
    }
  );
  const status = isNew ? 201 : 200;
  console.log(data);

  res.status(status).json({
    status,
    message: "Contact updated successfully",
    data: data,
  });
};

export const updateContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  let photo;

  if (req.file) {
    if (enableCloudinary === "true") {
      photo = await saveFileToCloudinary(req.file, "photos");
    } else {
      photo = await saveFileToUploadDir(req.file);
    }
  }

  const result = await contactServices.updateContact(
    { _id: id, userId },
    { ...req.body, photo }, // Додаємо photo до даних для оновлення
    photo
  );

  if (!result) {
    throw createHttpError(404, `Contact with id = ${id} is not found`);
  }
  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.deleteContact({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(204).send();
};
