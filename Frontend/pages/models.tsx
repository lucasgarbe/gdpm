import Head from "next/head";
import Link from "next/link";
import ListElement from "../components/listElement";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import {
  fetchModels,
  useModels,
} from "../hooks/useModels";

export default function Models() {
  const { data, isLoading } = useModels();
    return (
        <>
            <Head>
                <title>GDPM</title>
                <meta name="description" content="Grafische Entwicklungsumgebung zur Modellierung und zum Management probabilistischer Modelle" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="bg-gray-100 dark:bg-gray-900 px-4 py-1 flex justify-between items-center">
                <p className="text-4xl">GDPM</p>
                <nav className="flex gap-6">
                    <Link href="/edit">New Model</Link>
                    <Link href="/login">Login</Link>
                </nav>
            </header>

            <main className="container mx-auto flex-grow pt-40">
                <p className="text-6xl font-bold text-center pb-20">Gespeicherte Models
                </p>

                <div className="flex flex-col gap-4">
                  {data?.map((model, index) => (
                <ListElement className="" model={model}/>
                  ))}
                </div>
            </main>

            <footer className="text-center font-light">
                GPDM - Projektstudium
            </footer>
        </>
    )
}
export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["models"],
    queryFn: () => fetchModels(),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
