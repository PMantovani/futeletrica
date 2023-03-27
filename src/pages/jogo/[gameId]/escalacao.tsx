import { AthleteCard } from "@/components/athlete_card";
import { ColorObj, colors } from "@/models/color";
import { Pill } from "@/components/pill";
import { useState } from "react";
import { GetServerSideProps, GetServerSidePropsContext, GetStaticPaths, GetStaticProps } from "next";
import { Header } from "@/components/header";
import { formatDate } from "@/formatters/date_formatter";
import { PageHead } from "@/components/page_head";
import { ssg } from "@/server/utils/ssg_helper";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { validateRouterQueryToNumber } from "@/utils/validate_router_query";

export default function Home() {
  const router = useRouter();
  const gameIdNumber = validateRouterQueryToNumber(router.query.gameId);

  const gameQuery = trpc.game.findById.useQuery(gameIdNumber);
  const rosterQuery = trpc.game.roster.findAllByGameId.useQuery(gameIdNumber);

  const [selectedColor, setSelectedColor] = useState(colors[0] as ColorObj);

  const athletes = rosterQuery.data?.find((i) => i.color === selectedColor.id)?.athletes;
  athletes?.sort((a, b) => b.position.localeCompare(a.position) || a.name.localeCompare(b.name));

  const calculateRosterAvg = () =>
    ((athletes?.reduce((prev, cur) => prev + (cur.rating ?? 0), 0) ?? 0) / (athletes?.length ?? 1)).toFixed(3);

  if (!gameQuery.data || !rosterQuery.data) {
    throw new Error("Data was not prefetched during SSG");
  }

  return (
    <>
      <PageHead description={`Confira a escalação do jogo do dia ${formatDate(gameQuery.data.gameDate)}`} />
      <main className="flex h-screen flex-col bg-neutral-900">
        <Header />
        <div className="mx-auto text-xl text-yellow">Escalação do dia {formatDate(gameQuery.data.gameDate)}</div>
        <div className="mt-8 flex justify-center">
          {colors.map((color, idx) => (
            <div className="mx-1" key={idx}>
              <Pill isSelected={selectedColor === colors[idx]} onClick={() => setSelectedColor(colors[idx])}>
                {color.label}
              </Pill>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 text-yellow">Nota média do time: {calculateRosterAvg()}</div>
        <div className="soccer-field m-auto mt-6 flex h-full w-full xl:w-8/12">
          <div className="relative w-full">
            {athletes?.map((athlete, idx) => (
              <AthleteCard athlete={athlete} color={selectedColor.id} idx={idx} key={idx} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const gameId = validateRouterQueryToNumber(context.params?.gameId);

  await Promise.all([ssg.game.findById.prefetch(gameId), ssg.game.roster.findAllByGameId.prefetch(gameId)]);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};
