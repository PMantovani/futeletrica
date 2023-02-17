// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Rooster } from "@/models/rooster";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Rooster[]>
) {
  res.status(200).json([
    {
      color: "blue",
      athletes: [
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "4" },
        { id: "5" },
      ],
    },
    {
      color: "white",
      athletes: [
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "4" },
        { id: "5" },
      ],
    },
    {
      color: "yellow",
      athletes: [
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "4" },
        { id: "5" },
      ],
    },
  ]);
}
