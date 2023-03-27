import { DateTime } from "luxon";

export const formatDate = (date: string | Date) => {
  if (typeof date === "string") {
    return DateTime.fromISO(date).toFormat("dd/MM/yyyy");
  }
  return DateTime.fromJSDate(date).toFormat("dd/MM/yyyy");
};
