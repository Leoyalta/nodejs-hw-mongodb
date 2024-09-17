import { SORT_ORDER } from "../constants/index.js";
const parseSortParams = ({ sortBy, sortOrder, sortFields }) => {
  const parsedSortBy = sortFields.includes(sortBy) ? sortBy : "_id";
  const parseSortOrder = SORT_ORDER.includes(sortOrder)
    ? sortOrder
    : SORT_ORDER[0];

  return { sortBy: parsedSortBy, sortOrder: parseSortOrder };
};

export default parseSortParams;
