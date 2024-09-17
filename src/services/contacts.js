import ContactCollection from "../db/models/contact.js";
import calculatePaginationData from "../utils/culculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";
export const getContacts = async ({
  perPage,
  page,
  sortBy = "_id",
  sortOrder = SORT_ORDER[0],
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactCollection.find();
  if (filter.contactType) {
    contactsQuery.where("contactType").equals(filter.contactType);
  }
  if (typeof filter.isFavorite === "boolean") {
    contactsQuery.where("isFavorite").equals(filter.isFavorite);
  }

  const contacts = await contactsQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const count = await ContactCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  console.log(filter);

  const paginationData = calculatePaginationData({ count, perPage, page });

  return {
    page,
    perPage,
    contacts,
    totalItems: count,
    ...paginationData,
  };
};

export const getContactById = (contactId) =>
  ContactCollection.findById(contactId);

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (filter, data, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(filter, data, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });
  if (!rawResult || !rawResult.value) return null;
  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject?.upserted),
  };
};

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
