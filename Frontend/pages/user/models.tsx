import Head from "next/head";
import ListElement from "../../components/listElement";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { fetchModels, useModels, usePublicModels, useUserModels } from "../../hooks/useModels";
import Header from "../../components/Header";
import { useStore } from "../../hooks/useStore";
import authStore from "../../stores/auth";
import { useEffect, useState } from "react";

export default function Models() {
  console.log('Models');
  const store = useStore(authStore, (state) => state);
  // const [user, setUser] = useState();

  // useEffect(() => {
  //   console.log('useEffect');
  //   let localStore = JSON.parse(localStorage.getItem('auth'));
  //   localStore = localStore?.state;
  //   console.log(localStore?.user?.user_id);
  //   setUser(localStore?.state.user);
  // }, []);

  const { data, isLoading } = useUserModels(store?.user?.user_id);
    

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
        <h1 className="text-5xl font-medium mt-12">Models for {store?.user?.username}</h1>

        <div className="flex flex-col gap-4 mt-6">
          {data?.map((model) => (
            <ListElement key={model.id} className="" model={model} />
          ))}
        </div>
      </main>

      <footer className="text-center font-light">GPDM - Projektstudium</footer>
    </>
  );
}


