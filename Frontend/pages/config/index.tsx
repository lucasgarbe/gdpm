import { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import Header from '../../components/Header';
import Head from 'next/head';
import { useMutation, useQuery } from '@tanstack/react-query';
import ky from 'ky';

export default function ConfigEditor() {
  const [value, setValue] = useState("console.log('hello world!');");

  const { data, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: () => ky(`${process.env.NEXT_PUBLIC_API_URL}/config/`).text().then((data) => {
      setValue(data);
      return data;
    }),
  });

  // useMutation for saving the config
  const { mutate } = useMutation({
    mutationKey: ['config'],
    mutationFn: () => ky.post(`${process.env.NEXT_PUBLIC_API_URL}/config/`, {
      json: {config: value}
    }).json().then((data) => (data)),
  });

  const onChange = useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);

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
        <h1>Config Editor</h1>

        <button onClick={() => mutate()}>Save</button>
        <CodeMirror
          value={data}
          extensions={[javascript({ jsx: true })]}
          onChange={onChange}
        />

      </main>
    </>
  );
}
