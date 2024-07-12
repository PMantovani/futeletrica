import { AthleteSeasonSummary } from "@/models/athlete_season_summary";
import { getCssColorVariable } from "@/utils/functions";
import {
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
  Tooltip,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

type Props = {
  gamesSequence: AthleteSeasonSummary["gamesSequence"];
};

export const RatingProgressChart: React.FC<Props> = (props) => {
  const primaryColorHigh = getCssColorVariable("--color-textHigh");
  const primaryColorLow = getCssColorVariable("--color-textLow");
  const neutral = getCssColorVariable("--color-textNeutral");
  const victory = getCssColorVariable("--color-positive");
  const loss = getCssColorVariable("--color-negative");
  const defaultFont = {
    family: "NotoSans",
    size: 12,
    lineHeight: 1.333,
  };

  function getColorForIndex(idx: number) {
    const result = props.gamesSequence[idx]?.result;
    switch (result) {
      case "victory":
        return victory;
      case "draw":
        return neutral;
      case "absent":
        return "rgba(0,0,0,0)";
      case "loss":
        return loss;
      default:
        return primaryColorHigh;
    }
  }

  function buildBackgroundGradient(ctx: ScriptableContext<"line">) {
    if (!ctx.chart.chartArea) {
      return undefined;
    }
    const top = ctx.chart.chartArea.top;
    const bottom = ctx.chart.chartArea.bottom;
    const gradient = ctx.chart.ctx.createLinearGradient(0, top, 0, bottom);
    gradient.addColorStop(0, primaryColorHigh + "60");
    gradient.addColorStop(1, primaryColorLow + "20");
    return gradient;
  }

  const data: ChartData<"line", number[], unknown> = {
    labels: props.gamesSequence.map((i) => i.date.toISOString()),
    datasets: [
      {
        data: props.gamesSequence.map((i) => i.newRating),
        borderColor: (ctx) => getColorForIndex(ctx.dataIndex),
        pointBorderWidth: 3,
        borderWidth: 0.4,
        tension: 0.4,
        pointBackgroundColor: (ctx) => getColorForIndex(ctx.dataIndex),
        backgroundColor: buildBackgroundGradient,
        fill: {
          target: "origin",
        },
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          color: primaryColorLow,
          font: defaultFont,
          callback: (idx) => {
            const dt = props.gamesSequence[idx as number].date;
            const pad = (n: number) => String(n).padStart(2, "0");
            return `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}`;
          },
        },
        grid: {
          display: false,
          color: primaryColorLow + "20",
        },
      },
      y: {
        ticks: {
          color: primaryColorLow,
          font: defaultFont,
        },
        grid: {
          color: primaryColorLow + "20",
        },
      },
    },

    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        titleColor: primaryColorHigh,
        titleFont: defaultFont,
        bodyColor: primaryColorHigh,
        bodyFont: defaultFont,
        usePointStyle: true,
        cornerRadius: 4,
        padding: 8,
        callbacks: {
          title: (ctx) => {
            const dt = new Date(ctx[0].label);
            return Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(dt);
          },
          label: (ctx) => {
            const result = props.gamesSequence[ctx.dataIndex].result;
            const rating = props.gamesSequence[ctx.dataIndex].newRating;
            switch (result) {
              case "absent":
                return "Ausente - Rating: " + rating;
              case "draw":
                return "Empate - Rating: " + rating;
              case "loss":
                return "Derrota - Rating: " + rating;
              case "victory":
                return "Vitória - Rating: " + rating;
              default:
                return "";
            }
          },
        },
      },
    },
  };

  return <Line className="h-48" data={data} options={options} />;
};
