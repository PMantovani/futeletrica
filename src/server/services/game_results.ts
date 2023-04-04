import { NewGameResult, OperateOnGameResultInput } from "@/models/game_result";
import { GameResult } from "@prisma/client";
import { prisma } from "../utils/prisma_client";

export const findGameResultsByGameId = async (gameId: number) => {
  return prisma.gameResult.findMany({ where: { gameId }, orderBy: { match: "asc" } });
};

export const createGameResults = async (gameResults: NewGameResult[]) => {
  await prisma.gameResult.createMany({ data: gameResults });
};

export const updateGameResults = async (gameResults: GameResult[]) => {
  for (const result of gameResults) {
    await prisma.gameResult.update({ data: result, where: { id: result.id } });
  }
};

export const deleteGameResults = async (gameResults: GameResult[]) => {
  await prisma.gameResult.deleteMany({ where: { id: { in: gameResults.map((i) => i.id) } } });
};

export const operateOnResults = async (input: OperateOnGameResultInput) => {
  await Promise.all([
    createGameResults(input.create),
    updateGameResults(input.update),
    deleteGameResults(input.delete),
  ]);
};
