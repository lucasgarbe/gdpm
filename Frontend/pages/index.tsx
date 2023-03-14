import Head from "next/head";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <Head>
                <title>GDPM</title>
                <meta name="description" content="Grafische Entwicklungsumgebung zur Modellierung und zum Management probabilistischer Modelle" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="
                bg-gray-100
                dark:bg-gray-900
                px-4
                py-1
                flex
                justify-between
                items-center
                ">
                <h1 className="text-4xl">GDPM</h1>
                <nav className="flex gap-6">
                    <Link href="/edit">New Model</Link>
                    <Link href="/login">Login</Link>
                </nav>
            </header>

            <main className="flex-grow pt-40">
            <div className="container mx-auto flex-grow pt-40">
                <p className="text-6xl font-bold text-left text-amber-500">Grafische</p>
                <p className="text-6xl font-bold text-left text-amber-500">Entwicklungsumgebung</p>
                <p className="text-6xl font-bold text-left">zur Modellierung und</p>
                <p className="text-6xl font-bold text-left">zum Management</p>
                <p className="text-6xl font-bold text-left text-amber-500"> probabilistischer Modelle</p>
                <div className="h-32"><p className="text-right mb-5">Beschreibungstext</p></div>
                </div>

                <div className="
                h-64  w-full
                  bg-amber-500">
                  <div className="container mx-auto flex justify-between py-6">
                    <div className="w-1/2">
                    <img src="https://via.placeholder.com/150"/></div>
                    <div  className="w-1/2">
                      <p>probabilistische Modelle erstellen</p>
                    </div>
                  </div>
                </div>

                <div className="
                h-64  w-full
                  bg-zinc-200">
                  <div className="container mx-auto">
                    <div>Bild</div>
                    <div>probabilistische Modelle erstellen</div>
                  </div>
                </div>


                <div className="
                h-64  w-full
                  bg-amber-500">
                  <div className="container mx-auto">
                    <div>Bild</div>
                    <div>probabilistische Modelle erstellen</div>
                  </div>
                </div>

            </main>


            <footer className="text-center font-light">
                GPDM - Projektstudium
            </footer>
        </>
    )
}
