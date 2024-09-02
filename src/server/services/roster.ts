import { Color, colors } from "@/models/color";
import { Athlete, Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma_client";

export const findAllRostersByGameId = async (gameId: number) => {
  const result = await prisma.roster.findMany({
    where: { gameId },
    include: {
      athletes: { include: { athlete: true } },
    },
  });

  return result.map((i) => ({
    id: i.id,
    gameId: i.gameId,
    color: i.color,
    athletes: i.athletes.map((j) => j.athlete),
    createdAt: i.createdAt,
  }));
};

type AthleteWithColor = Athlete & { color: Color };

export const generateRoster = async (athleteIds: bigint[], gameId: bigint) => {
  const selectedAthletes = await prisma.athlete.findMany({ where: { id: { in: athleteIds } } });
  const ata = selectedAthletes.filter((i) => i.position === "ATA");
  const mei = selectedAthletes.filter((i) => i.position === "MEI");
  const vol = selectedAthletes.filter((i) => i.position === "VOL");
  const zag = selectedAthletes.filter((i) => i.position === "ZAG");
  const gol = selectedAthletes.filter((i) => i.position === "GOL");

  const numberOfIterations = 1000;

  let bestRosters: AthleteWithColor[] = [];
  let bestRostersDiscrepancy = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < numberOfIterations; i++) {
    shuffleArray(ata);
    shuffleArray(mei);
    shuffleArray(vol);
    shuffleArray(zag);
    const shuffledColors = [...colors];
    shuffleArray(shuffledColors);
    let nextIdx = 0;

    const findNextColorId = (idx: number) => shuffledColors[(nextIdx + idx) % shuffledColors.length].id;

    const ataWithColor = ata.map((i, idx) => ({ ...i, color: findNextColorId(idx) }));
    nextIdx = ata.length % shuffledColors.length;
    const meiWithColor = mei.map((i, idx) => ({ ...i, color: findNextColorId(idx) }));
    nextIdx = (ata.length + mei.length) % shuffledColors.length;
    const volWithColor = vol.map((i, idx) => ({ ...i, color: findNextColorId(idx) }));
    nextIdx = (ata.length + mei.length + vol.length) % shuffledColors.length;
    const zagWithColor = zag.map((i, idx) => ({ ...i, color: findNextColorId(idx) }));
    const golWithColor = gol.map<AthleteWithColor>((i) => ({ ...i, color: "neutral" }));
    const fullRoster = [...ataWithColor, ...meiWithColor, ...volWithColor, ...zagWithColor, ...golWithColor];
    const sumScore = (prev: number, cur: AthleteWithColor) => prev + cur.rating;
    const scores = colors.map((color) => fullRoster.filter((i) => i.color === color.id).reduce(sumScore, 0));
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const discrepancy = highest - lowest;

    if (discrepancy < bestRostersDiscrepancy) {
      bestRostersDiscrepancy = discrepancy;
      bestRosters = fullRoster;
    }
  }

  await storeBestRostersInDb(bestRosters, gameId);
};

const storeBestRostersInDb = async (bestRosters: AthleteWithColor[], gameId: bigint) => {
  const neutralColor = { id: "neutral", label: "Neutral" } as const;
  const formattedRosters: Prisma.RosterCreateInput[] = [...colors, neutralColor].map((color) => {
    const athletes = bestRosters.filter((i) => i.color === color.id);
    const roster: Prisma.RosterCreateInput = {
      color: color.id,
      Game: { connect: { id: gameId } },
      athletes: { createMany: { data: athletes.map((i) => ({ athleteId: i.id })) } },
    };
    return roster;
  });

  const deleteExistingOperation = prisma.roster.deleteMany({ where: { gameId } });
  const createNewOperations = formattedRosters.map((roster) => prisma.roster.create({ data: roster }));

  await prisma.$transaction([deleteExistingOperation, ...createNewOperations]);
};

function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
