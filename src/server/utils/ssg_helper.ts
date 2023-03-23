import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../routers/_app";

export const ssg = createProxySSGHelpers({
  router: appRouter,
  ctx: {},
});
