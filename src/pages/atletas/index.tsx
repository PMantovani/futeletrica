import { ArrowIcon } from "@/components/arrow_icon";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { PageHead } from "@/components/page_head";
import { trpc } from "@/utils/trpc";
import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import React, { useState } from "react";

export default function Atletas() {
  const { data } = trpc.athlete.getAthleteStandings.useQuery();
  const [sortBy, setSortBy] = useState<"change" | "overall">("change");
  const sortedData = data
    ? sortBy === "change"
      ? [...data].sort((a, b) => b.seasonChange - a.seasonChange || b.rating - a.rating || a.name.localeCompare(b.name))
      : [...data].sort((a, b) => b.rating - a.rating || b.seasonChange - a.seasonChange || a.name.localeCompare(b.name))
    : null;

  return (
    <>
      <PageHead description="Confira os atletas do maior time do sul do mundo!" />
      <main className="flex flex-col bg-neutral-900">
        <Header />

        <div className="flex flex-col items-center">
          <Link href={`/atletas/ranking`}>
            <Button>Ranking</Button>
          </Link>
          <Link href={`/atletas/todos`}>
            <Button>Todos os atletas</Button>
          </Link>
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
