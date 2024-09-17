const parseType = (type) => {
  if (typeof type !== "string") return;

  const allContactTypes = ["personal", "home", "work"];

  if (allContactTypes.includes(type)) {
    return type;
  }
};

const parseIsFavorite = (isFavorite) => {
  if (typeof isFavorite !== "string") return;

  return isFavorite === "true"
    ? true
    : isFavorite === "false"
    ? false
    : undefined;
};

const parseContactFilterParams = ({ type, isFavorite }) => {
  const parsedType = parseType(type);
  const parsedIsFavorite = parseIsFavorite(isFavorite);

  return {
    contactType: parsedType,
    isFavorite: parsedIsFavorite,
  };
};

export default parseContactFilterParams;
