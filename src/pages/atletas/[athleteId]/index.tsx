import { Header } from "@/components/header";
import { PageHead } from "@/components/page_head";
import { useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { AthleteCardImage } from "@/components/athlete_card_image";
import { Icon, ICON_NAME } from "@/components/icon/icon";
import { roundToDecimalPlaces } from "@/utils/functions";
import { routerQueryToNumberOrUndefined } from "@/utils/validate_router_query";
import { useRouter } from "next/router";
import { RatingProgressChart } from "@/components/rating_progress_chart";

export default function AthleteSummaryPage() {
  function calculateStatistics(summary: typeof seasonSummary) {
    if (!summary) {
      return undefined;
    }

    const totalGamesPlayed = summary.gamesSequence.filter((i) => i.result !== "absent").length;

    return {
      name: summary.name,
      rating: summary.rating,
      ratingChange: roundToDecimalPlaces(summary.rating - summary.initialRating),
      rankingPosition: summary.rankingPosition,
      absoluteRankingPosition: summary.absoluteRankingPosition,
      totalPeopleInRanking: summary.totalPeopleInRanking,
      victories: summary.gamesSequence.filter((i) => i.result === "victory").length,
      draws: summary.gamesSequence.filter((i) => i.result === "draw").length,
      losses: summary.gamesSequence.filter((i) => i.result === "loss").length,
      goalsScoredAvg: summary.gamesSequence.reduce((prev, cur) => prev + cur.goalsScored, 0) / totalGamesPlayed,
      goalsAgainstAvg: summary.gamesSequence.reduce((prev, cur) => prev + cur.goalsAgainst, 0) / totalGamesPlayed,
      largestVictorySequence: getLargestVictorySequence(summary),
      largestUndefeatedSequence: getLargestUndefeatedSequence(summary),
      numberOfGamesPlayed: totalGamesPlayed,
      presence: totalGamesPlayed / summary.gamesSequence.length,
    };
  }

  function getLargestVictorySequence(summary: typeof seasonSummary) {
    let currentSequence = 0;
    let largestSequence = 0;
    const nonAbsentSequence = (summary?.gamesSequence ?? []).filter((i) => i.result !== "absent");

    for (const game of nonAbsentSequence) {
      if (game.result === "victory") {
        currentSequence++;
      } else {
        largestSequence = Math.max(currentSequence, largestSequence);
        currentSequence = 0;
      }
    }
    largestSequence = Math.max(currentSequence, largestSequence);

    return largestSequence;
  }

  function getLargestUndefeatedSequence(summary: typeof seasonSummary) {
    let currentSequence = 0;
    let largestSequence = 0;
    const nonAbsentSequence = (summary?.gamesSequence ?? []).filter((i) => i.result !== "absent");

    for (const game of nonAbsentSequence) {
      if (game.result !== "loss") {
        currentSequence++;
      } else {
        largestSequence = Math.max(currentSequence, largestSequence);
        currentSequence = 0;
      }
    }
    largestSequence = Math.max(currentSequence, largestSequence);

    return largestSequence;
  }

  const router = useRouter();
  const athleteId = routerQueryToNumberOrUndefined(router.query.athleteId);
  const { data: seasonSummary } = trpc.athlete.getAthleteSeasonSummary.useQuery(athleteId ?? 1, {
    enabled: athleteId !== undefined,
  });
  const stats = calculateStatistics(seasonSummary);

  if (athleteId === undefined || !stats || !seasonSummary) {
    return (
      <>
        <PageHead description="Confira o maior time do sul do mundo!" />
        <main className="mx-auto flex h-screen max-w-3xl flex-col bg-surface">
          <Header />
          <div className="mx-auto text-md text-textHigh">Carregando...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHead description="Confira o maior time do sul do mundo!" />
      <main className="mx-auto flex h-screen max-w-3xl flex-col bg-surface">
        <Header />
        <div className="px-4 pb-4">
          <div className="flex gap-4">
            <div className="w-40 relative">
              <AthleteCardImage athleteId={athleteId} athleteName={stats.name} color="yellow" />
            </div>
            <div className="flex flex-auto flex-col gap-4">
              <div className="text-center text-xl text-textHigh">{stats.name}</div>
              <div className="flex flex-col">
                <div className="text-sm text-textLow">Rating</div>
                <div className="flex items-center">
                  <div className="text-xl font-bold text-textHigh">{stats.rating}</div>
                  <div className={"flex pt-2" + (stats.ratingChange >= 0 ? " text-positive" : " text-negative")}>
                    <Icon
                      name={stats.ratingChange >= 0 ? ICON_NAME.ARROW_UP : ICON_NAME.ARROW_DOWN}
                      className="h-4 w-4"
                    />
                    <div className="text-sm">{stats.ratingChange}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <div className="flex flex-auto flex-col">
                  <div className="text-sm text-textLow">Ranking</div>
                  <div className="flex items-baseline">
                    <div className="text-xl text-textHigh">#{stats.rankingPosition}</div>
                    <div className="text-sm text-textLow">/{stats.totalPeopleInRanking}</div>
                  </div>
                </div>
                <div className="flex flex-auto flex-col">
                  <div className="whitespace-nowrap text-sm text-textLow">Ranking abs.</div>
                  <div className="flex items-baseline">
                    <div className="text-xl text-textHigh">#{stats.absoluteRankingPosition}</div>
                    <div className="text-sm text-textLow">/{stats.totalPeopleInRanking}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-sm text-textLow">V/E/D</div>
                <div className="flex text-md">
                  <span className="text-positive">{stats.victories}</span>
                  <span className="text-textNeutral">&nbsp;/ {stats.draws} /&nbsp;</span>
                  <span className="text-negative">{stats.losses}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="my-4 w-full border-b border-solid border-borderMedium"></div>

          <div className="pb-4 text-center text-md text-textMedium">Evolução rating</div>
          <RatingProgressChart gamesSequence={seasonSummary.gamesSequence} />

          <div className="my-4 w-full border-b border-solid border-borderMedium"></div>

          <div className="pb-4 text-center text-md text-textMedium">Sequência de jogos</div>

          <div className="flex flex-wrap items-center gap-2">
            {seasonSummary.gamesSequence.map((game, index) =>
              game.result === "absent" ? (
                <div key={index} className="h-1 w-4 bg-textNeutral"></div>
              ) : (
                <div
                  key={index}
                  className={
                    "h-4 w-4 rounded-full " +
                    (game.result === "victory"
                      ? "bg-positive"
                      : game.result === "draw"
                      ? "bg-textNeutral"
                      : "bg-negative")
                  }
                ></div>
              )
            )}
          </div>

          <div className="my-4 w-full border-b border-solid border-borderMedium"></div>

          <div className="pb-4 text-center text-md text-textMedium">Estatísticas</div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-auto flex-col items-center">
              <div className="text-center text-sm text-textMedium">Gols pró - time</div>
              <div className="flex items-baseline">
                <div className="text-xl font-bold text-textHigh">{stats.goalsScoredAvg.toFixed(1)}</div>
                <div className="text-sm text-textLow">/jogo</div>
              </div>
            </div>
            <div className="flex flex-auto flex-col items-center">
              <div className="text-center text-sm text-textMedium">Gols contra - time</div>
              <div className="flex items-baseline">
                <div className="text-xl font-bold text-textHigh">{stats.goalsAgainstAvg.toFixed(1)}</div>
                <div className="text-sm text-textLow">/jogo</div>
              </div>
            </div>
            <div className="flex flex-auto flex-col items-center">
              <div className="text-center text-sm text-textMedium">Maior sequência de vitórias</div>
              <div className="text-xl font-bold text-textHigh">{stats.largestVictorySequence}</div>
            </div>
            <div className="flex flex-auto flex-col items-center">
              <div className="text-center text-sm text-textMedium">Maior sequência sem perder</div>
              <div className="text-xl font-bold text-textHigh">{stats.largestUndefeatedSequence}</div>
            </div>
            <div className="flex flex-auto flex-col items-center">
              <div className="text-center text-sm text-textMedium">Número de jogos</div>
              <div className="text-xl font-bold text-textHigh">{stats.numberOfGamesPlayed}</div>
            </div>
            <div className="flex flex-auto flex-col items-center">
              <div className="text-center text-sm text-textMedium">Presença</div>
              <div className="text-xl font-bold text-textHigh">{(stats.presence * 100).toFixed(0) + "%"}</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
