import { prisma } from "../utils/prisma_client";

export const findAllAthletes = () => {
  return prisma.athlete.findMany();
};
