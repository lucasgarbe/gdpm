import React from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import LocalFont from "@next/font/local";
import {
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const font = LocalFont({
    src: "../public/ClashGrotesk-Variable.ttf",
    variable: "--font-clash",
});

export default function App({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <main className={`${font.variable} layout font-sans flex flex-col justify-between`} >
                    <Component {...pageProps} />
                </main>
            </Hydrate>
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}
