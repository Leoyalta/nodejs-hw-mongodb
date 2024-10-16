const parseInteger = (value, defaultValue) => {
  if (typeof value !== "string") return defaultValue;
  const parsedValue = parseInt(value);
  if (Number.isNaN(parsedValue)) return defaultValue;
  return parsedValue;
};
const parsePaginationParams = ({ page, perPage }) => {
  const parsedPerPage = parseInteger(perPage, 10);
  const parsedPage = parseInteger(page, 1);
  return {
    perPage: parsedPerPage,
    page: parsedPage,
  };
};
export default parsePaginationParams;
