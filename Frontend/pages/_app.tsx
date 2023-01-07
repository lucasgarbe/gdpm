import '../styles/globals.css'
import type { AppProps } from 'next/app'
import LocalFont from "@next/font/local";

const font = LocalFont({
    src: "../public/ClashGrotesk-Variable.ttf",
    variable: "--font-clash",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${font.variable} layout font-sans flex flex-col justify-between`} >
        <Component {...pageProps} />
    </main>
    )
}
