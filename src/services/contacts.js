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
  if (filter.userId) {
    contactsQuery.where("userId").equals(filter.userId);
  }

  const [count, contacts] = await Promise.all([
    ContactCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData({ count, page, perPage });

  return {
    contacts,
    page,
    perPage,
    totalItems: count,
    ...paginationData,
  };
};

export const getContact = (filter) => ContactCollection.findById(filter);

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
