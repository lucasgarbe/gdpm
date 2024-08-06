import Head from "next/head";
import Header from "../components/Header";

export default function Home() {
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

      <main className="flex-grow pt-34">
        <div className="container mx-auto py-40 text-7xl font-semibold leading-tight">
            <p >
              Grafische
            </p>
            <p >
              Entwicklungsumgebung
            </p>
            <p>
              zur Modellierung und
            </p>
            <p>
              zum Management
            </p>
            <p>
              probabilistischer Modelle
            </p>
        </div>
      </main>

      <footer className="text-center font-light">GPDM - Projektstudium</footer>
    </>
  );
}
