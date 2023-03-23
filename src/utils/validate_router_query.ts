export const validateRouterQueryToNumber = (val: string | string[] | undefined) => {
  if (typeof val !== "string") {
    throw "Unknown type for router parameter";
  }
  return parseInt(val);
};
