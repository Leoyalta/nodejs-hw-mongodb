import ContactCollection from "../db/models/contact.js";

export const getAllContacts = () => ContactCollection.find();

export const getMovieById = (contactId) =>
  ContactCollection.findById(contactId);
