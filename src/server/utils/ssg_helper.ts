import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { appRouter } from "../routers/_app";

export const ssg = createProxySSGHelpers({
  router: appRouter,
  ctx: {},
  transformer: superjson,
});
