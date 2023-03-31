export const validateRouterQueryToNumber = (val: string | string[] | undefined) => {
  if (typeof val !== "string") {
    return 0;
  }
  return parseInt(val);
};
