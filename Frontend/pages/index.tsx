import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>GDPM</title>
        <meta
          name="description"
          content="Grafische Entwicklungsumgebung
                zur Modellierung und zum Management
                probabilistischer Modelle"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header
        className="
                bg-gray-100
                dark:bg-gray-900
                px-4
                py-1
                flex
                justify-between
                items-center
                "
      >
        <h1 className="text-4xl">GDPM</h1>
        <nav className="flex gap-6">
          <Link href="/models/new">New Model</Link>
          <Link href="/login">Login</Link>
        </nav>
      </header>

      <main className="container mx-auto flex-grow pt-40">
        <p className="text-6xl font-bold text-center">
          Grafische Entwicklungsumgebung zur Modellierung und zum Management
          probabilistischer Modelle
        </p>
      </main>

      <footer className="text-center font-light">GPDM - Projektstudium</footer>
    </>
  );
}
