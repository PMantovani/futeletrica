import { DateTime } from "luxon";

export const formatDate = (date: string) => {
  return DateTime.fromISO(date).toFormat("dd/MM/yyyy");
};
