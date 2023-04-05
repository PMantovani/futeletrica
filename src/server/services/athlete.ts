import { Athlete } from "@prisma/client";
import { prisma } from "../utils/prisma_client";

export const findAllAthletes = () => {
  return prisma.athlete.findMany();
};

export const updateAthletes = (athletes: Athlete[]) => {
  return prisma.$transaction(
    athletes.map((athlete) => prisma.athlete.update({ data: athlete, where: { id: athlete.id } }))
  );
};
