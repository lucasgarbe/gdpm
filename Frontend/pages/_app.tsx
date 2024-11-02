import { useEffect, useState } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import LocalFont from "next/font/local";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthLog from "../components/authLog";
import authStore from "../stores/auth";
import { log } from "console";

const font = LocalFont({
  src: "../public/ClashGrotesk-Variable.ttf",
  variable: "--font-clash",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps}
}: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const { isRefreshTokenExpired, logout } = authStore();

  useEffect(() => {
    if (isRefreshTokenExpired()) {
      logout();
    }
  }, []);

  return (
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <AuthLog />
          <main
            className={`${font.variable} min-h-full font-sans flex flex-col justify-between bg-stone-100`}
          >
            <Component {...pageProps} />
          </main>
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
  );
}
