import { ArrowIcon } from "@/components/arrow_icon";
import { Header } from "@/components/header";
import { PageHead } from "@/components/page_head";
import { trpc } from "@/utils/trpc";
import { type VariantProps, cva } from "class-variance-authority";
import React, { useState } from "react";

export default function Atletas() {
  const { data } = trpc.athlete.getAthleteStandings.useQuery();
  const [sortBy, setSortBy] = useState<"change" | "overall">("change");
  const sortedData = data
    ? sortBy === "change"
      ? [...data].sort((a, b) => b.seasonChange - a.seasonChange || b.rating - a.rating || a.name.localeCompare(b.name))
      : [...data].sort((a, b) => b.rating - a.rating || b.seasonChange - a.seasonChange || a.name.localeCompare(b.name))
    : null;

  if (!sortedData) {
    return (
      <>
        <PageHead description="Confira os atletas do maior time do sul do mundo!" />
        <main className="flex flex-col bg-neutral-900">
          <Header />
          <div className="text-yellow">Loading</div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHead description="Confira os atletas do maior time do sul do mundo!" />
      <main className="flex flex-col bg-neutral-900">
        <Header />
        <div className="flex flex-col">
          <h2 className="mx-auto mb-4 text-xl font-bold text-yellow">Ranking de atletas</h2>

          <div className="mx-auto overflow-x-auto">
            <table>
              <thead className="fill-neutral-500 text-center text-sm uppercase text-neutral-500">
                <tr className="border-b-2 border-solid border-neutral-800">
                  <th className="px-3 py-3 even:bg-neutral-800">Atleta</th>
                  <th className="px-3 py-3 even:bg-neutral-800">Pos.</th>
                  <HeaderWithSort
                    className="px-3 py-3 even:bg-neutral-800"
                    onClick={() => setSortBy("overall")}
                    showArrow={sortBy === "overall"}
                  >
                    <span className="inline md:hidden">Pont.</span>
                    <span className="hidden md:inline">Pontuação</span>
                  </HeaderWithSort>

                  <HeaderWithSort
                    className="px-3 py-3 even:bg-neutral-800"
                    onClick={() => setSortBy("change")}
                    showArrow={sortBy === "change"}
                  >
                    <span className="inline md:hidden">Var. temp.</span>
                    <span className="hidden md:inline">Var. temporada</span>
                  </HeaderWithSort>

                  <th className="px-3 py-3 even:bg-neutral-800">Últ. jogos</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {sortedData.map((athlete, idx) => {
                  const intent = idx === 0 ? "first" : idx === 1 ? "second" : idx === 2 ? "third" : null;
                  const seasonChangeResult =
                    athlete.seasonChange < 0 ? "negative" : athlete.seasonChange === 0 ? "neutral" : "positive";
                  return (
                    <tr
                      key={idx}
                      className={`border-b border-solid border-neutral-800 text-yellow last-of-type:border-0`}
                    >
                      <Cell intent={intent} className="whitespace-nowrap text-start">
                        <span className="mr-4">{idx + 1}</span>
                        <span>{athlete.name}</span>
                      </Cell>
                      <Cell intent={intent}>{athlete.position}</Cell>
                      <Cell intent={intent}>{athlete.rating.toFixed(2)}</Cell>
                      <Cell intent={intent}>
                        <SeasonChangeCell intent={seasonChangeResult} value={athlete.seasonChange} />
                      </Cell>
                      <Cell intent={intent}>
                        <ResultDotWrapper lastGames={athlete.lastGames} />
                      </Cell>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

const HeaderWithSort = (props: {
  onClick?: () => void;
  className?: string;
  showArrow?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <th className={props.className} onClick={props.onClick}>
      <div className="flex cursor-pointer items-center">
        {props.showArrow && <ArrowIcon className="h-4" />}
        <span>{props.children}</span>
      </div>
    </th>
  );
};

const cellCva = cva("px-3 py-3 even:bg-neutral-800", {
  variants: {
    intent: {
      first: "even:bg-amber-300 even:bg-opacity-30 bg-amber-300 bg-opacity-30 text-amber-400",
      second: "even:bg-slate-400 even:bg-opacity-30 bg-slate-400  bg-opacity-30 text-slate-300",
      third: "even:bg-amber-700 even:bg-opacity-30 bg-amber-700  bg-opacity-30 text-amber-600",
    },
  },
});
const Cell = (props: VariantProps<typeof cellCva> & { children: React.ReactNode; className?: string }) => (
  <td className={cellCva({ intent: props.intent, className: props.className })}>{props.children}</td>
);

const seasonChangeCellCva = cva(null, {
  variants: {
    intent: {
      positive: "text-green-300",
      neutral: "text-neutral-400",
      negative: "text-red-300",
    },
  },
});

const SeasonChangeCell = ({ intent, value }: VariantProps<typeof seasonChangeCellCva> & { value: number }) => (
  <div className={seasonChangeCellCva({ intent })}>{value.toFixed(2)}</div>
);

type ResultType = "win" | "neutral" | "loss";

const ResultDotWrapper = (props: { lastGames: ResultType[] }) => (
  <div className="mx-auto flex justify-center gap-1">
    {props.lastGames.map((result, idx) => (
      <ResultDot key={idx} intent={result} />
    ))}
  </div>
);

const resultDotCva = cva("h-2 w-2 rounded-full", {
  variants: {
    intent: {
      win: "bg-green-500",
      neutral: "bg-neutral-400",
      loss: "bg-red-600",
    },
  },
});

const ResultDot = ({ intent }: VariantProps<typeof resultDotCva>) => <div className={resultDotCva({ intent })}></div>;
