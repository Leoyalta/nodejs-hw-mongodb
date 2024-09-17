import * as contactServices from "../services/contacts.js";
import createHttpError from "http-errors";
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseSortParams from "../utils/parseSortParams.js";
import { sortFields } from "../db/models/contact.js";
import parseContactFilterParams from "../utils/filters/parseContactFilterParams.js";
export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });
  const filter = parseContactFilterParams(req.query);
  console.log(req.query);

  const data = await contactServices.getContacts({
    perPage,
    page,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    massage: "Succesfuiily found contacts",
    data,
  });
};
export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.getContactById(id);

  if (!data) {
    throw createHttpError(404, `Contact with id = ${id} is not found`);

    //   const error = new Error(`Contact with id = ${id} is not founD`);
    //   res.status = 404;
    //   throw error;
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const data = await contactServices.addContact(req.body);
  res.status(201).json({
    sstatus: 201,
    message: "Successfully created a contact!",
    data: data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;

  const { isNew, data } = await contactServices.updateContact(
    { _id: id },
    req.body,
    {
      upsert: true,
    }
  );
  const status = isNew ? 201 : 200;
  console.log(data);

  res.status(status).json({
    status: 200,
    message: "Contact updated successfully",
    data: data, // Оновлені дані контакту
  });
};

export const updateContactController = async (req, res) => {
  const { id } = req.params;
  const result = await contactServices.updateContact({ _id: id }, req.body);

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
  const data = await contactServices.deleteContact({ _id: id });

  if (!data) {
    throw createHttpError(404, "Contact not found");
  }

  res.status(204).send();
};
