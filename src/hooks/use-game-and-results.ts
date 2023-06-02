import { trpc } from "@/utils/trpc";
import { routerQueryToNumberOrUndefined } from "@/utils/validate_router_query";
import { useRouter } from "next/router";

export function useGameAndResultsFromQueryParam() {
  const router = useRouter();
  const gameIdNumber = routerQueryToNumberOrUndefined(router.query.gameId);
  const gameQuery = trpc.game.findById.useQuery(gameIdNumber ?? 0, { enabled: !!gameIdNumber });
  const gameResultsQuery = trpc.game.gameResults.findAllByGameId.useQuery(gameIdNumber ?? 0, {
    enabled: !!gameIdNumber,
  });

  return {
    gameQuery,
    gameResultsQuery,
    gameIdNumber,
  };
}
