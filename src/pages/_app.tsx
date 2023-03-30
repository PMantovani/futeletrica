import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </>
  );
}

export default trpc.withTRPC(App);
