import { NewGameResult } from "@/models/game_result";
import { GameResult } from "@prisma/client";
import { prisma } from "../utils/prisma_client";

export const findGameResultsByGameId = async (gameId: number) => {
  return prisma.gameResult.findMany({ where: { gameId } });
};

export const createGameResults = async (gameResults: NewGameResult[]) => {
  await prisma.gameResult.createMany({ data: gameResults });
};

export const updateGameResults = async (gameResults: GameResult[]) => {
  for (const result of gameResults) {
    await prisma.gameResult.update({ data: result, where: { id: result.id } });
  }
};
