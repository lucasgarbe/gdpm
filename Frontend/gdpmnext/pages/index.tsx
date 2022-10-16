import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>GDPM</title>
        <meta name="description" content="Graphical Development Environment for probabilistic models" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1 className="title">Graphical Development Environment for probabilistic models</h1>
      </header>

      <main className="main">

      </main>

      <footer>
        <a href="https://www.f4.htw-berlin.de/">HTW Berlin F4</a>
      </footer>
    </>
  )
}

export default Home
