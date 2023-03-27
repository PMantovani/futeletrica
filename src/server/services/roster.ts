import { Athlete } from "@prisma/client";
import { prisma } from "../utils/prisma_client";

export const findAllRostersByGameId = async (gameId: number) => {
  const result2 = await prisma.roster.findMany({
    where: { gameId },
    include: {
      Athlete_Roster_athlete1IdToAthlete: true,
      Athlete_Roster_athlete2IdToAthlete: true,
      Athlete_Roster_athlete3IdToAthlete: true,
      Athlete_Roster_athlete4IdToAthlete: true,
      Athlete_Roster_athlete5IdToAthlete: true,
    },
  });

  return result2.map((i) => {
    const athletes: Athlete[] = [];
    if (i.Athlete_Roster_athlete1IdToAthlete) {
      athletes.push(i.Athlete_Roster_athlete1IdToAthlete);
    }
    if (i.Athlete_Roster_athlete2IdToAthlete) {
      athletes.push(i.Athlete_Roster_athlete2IdToAthlete);
    }
    if (i.Athlete_Roster_athlete3IdToAthlete) {
      athletes.push(i.Athlete_Roster_athlete3IdToAthlete);
    }
    if (i.Athlete_Roster_athlete4IdToAthlete) {
      athletes.push(i.Athlete_Roster_athlete4IdToAthlete);
    }
    if (i.Athlete_Roster_athlete5IdToAthlete) {
      athletes.push(i.Athlete_Roster_athlete5IdToAthlete);
    }

    return {
      id: i.id,
      gameId: i.gameId,
      color: i.color,
      athletes: athletes,
      createdAt: i.createdAt,
    };
  });
};
