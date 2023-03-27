import { prisma } from "../utils/prisma_client";

export const findAllGames = async () => {
  return prisma.game.findMany();
};

export const findGameById = async (id: number) => {
  return prisma.game.findUnique({ where: { id } });
};
