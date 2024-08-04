import Head from "next/head";
import Header from "./Header";

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <title>GDPM</title>
                <meta
                    name="description"
                    content="Grafische Entwicklungsumgebung zur Modellierung und zum Management probabilistischer Modelle"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className="container mx-auto flex-grow">
                {children}
            </main>

            <footer className="text-center font-light">GPDM - Projektstudium</footer>
        </>
    )
}
