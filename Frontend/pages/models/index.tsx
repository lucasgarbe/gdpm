import Head from "next/head";
import ListElement from "../../components/listElement";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchModels, useModels } from "../../hooks/useModels";
import Header from "../../components/Header";

export default function Models() {
  const { data, isLoading } = useModels();
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
        <h1 className="text-5xl font-semibold mt-12">Saved Models</h1>

        <div className="flex flex-col gap-4 mt-6">
          {data?.map((model, index) => (
            <ListElement key={index} className="" model={model} />
          ))}
        </div>
      </main>

      <footer className="text-center font-light">GPDM - Projektstudium</footer>
    </>
  );
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
