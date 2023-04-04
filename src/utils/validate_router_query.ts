export const validateRouterQueryToNumber = (val: string | string[] | undefined) => {
  if (typeof val !== "string") {
    throw new Error("Invalid router query number");
  }
  return parseInt(val);
};

export const routerQueryToNumberOrUndefined = (val: string | string[] | undefined) => {
  if (typeof val !== "string") {
    return undefined;
  }
  return parseInt(val);
};
