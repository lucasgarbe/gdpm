import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import LocalFont from "next/font/local";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";

const font = LocalFont({
  src: "../public/ClashGrotesk-Variable.ttf",
  variable: "--font-clash",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps}
}: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <main
            className={`${font.variable} min-h-full font-sans flex flex-col justify-between bg-stone-100`}
          >
            <SessionProvider session={session}>
              <Component {...pageProps} />
            </SessionProvider>
          </main>
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
  );
}
