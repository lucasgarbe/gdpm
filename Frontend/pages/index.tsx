import Head from "next/head";
import Link from "next/link";
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';

export default function Home() {
    return (
        <>
            <Head>
                <title>GDPM</title>
                <meta name="description" content="Grafische Entwicklungsumgebung zur Modellierung und zum Management probabilistischer Modelle" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="bg-gray-100 dark:bg-gray-900 px-4 py-1 flex justify-between items-center">
                <h1 className="text-4xl">GDPM</h1>
                <nav className="flex gap-6">
                    <Link href="/edit">New Model</Link>
                    <Link href="/login">Login</Link>
                </nav>
            </header>

            <main className="flex-grow pt-34">
            <div className="container mx-auto pt-40">
            <div className="group">
                <p className="text-6xl font-bold text-left text-amber-500 group-hover:text-black">Grafische</p>
                <p className="text-6xl font-bold text-left text-amber-500 group-hover:text-black">Entwicklungsumgebung</p>
            </div>
              <div className="group">
                <p className="text-6xl font-bold text-left group-hover:text-amber-500">zur Modellierung und</p>
                <p className="text-6xl font-bold text-left group-hover:text-amber-500">zum Management</p>
              </div>
              <div className="group">
                <p className="text-6xl font-bold text-left text-amber-500 hover:text-black"> probabilistischer Modelle</p>
              </div>
                <div className="h-32"></div>
              </div>

                <div className="w-full bg-amber-500">
                  <div className="container mx-auto">
                    <div className="flex justify-center gap-4 py-10">
                    <Link href="/edit" className="hover:bg-black hover:text-amber-500 flex gap-4 py-2 px-3">
                      <DocumentPlusIcon className="h-8 w-8"/>
                      <p className="text-2xl font-bold hover:bg-black hover:text-amber-500">probabilistische Modelle erstellen</p>
                      </Link>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pb-10">
                <Link href="/models" className="hover:bg-black hover:text-amber-500 flex gap-4 py-2 px-3">
                  <ArrowUpTrayIcon className="h-8 w-8"/>
                  <p className="text-2xl font-bold ">Modelle verwalten</p>
                  </Link>
                </div>
                </div>
            </main>

            <footer className="text-center font-light">
                GPDM - Projektstudium
            </footer>
        </>
    )
}
// nur die Buchstaben der Überschrift hoverbar
