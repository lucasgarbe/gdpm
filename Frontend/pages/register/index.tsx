import ky from "ky";
import Head from "next/head";
import Link from "next/link";
import { Button, HighlightLink } from "../../components/ButtonsAndLinks";
import Header from "../../components/Header";
import SimpleInput from "../../components/SimpleInput";
import useAuth from "../../hooks/useAuth";

export default function Register() {
  const { register, error } = useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("submit", event)

    // get inputs from form
    const username = event.target[0].value
    const password = event.target[1].value

    register({username, password})
  }

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

        {error && <div>{error.toString()}</div>}
        <form className="max-w-md mx-auto flex flex-col items-center gap-4 mt-6" onSubmit={handleSubmit}>
          <label className="flex flex-col">Username:
            <SimpleInput type="text" placeholder="Username" />
          </label>
          <label className="flex flex-col">Password:
            <SimpleInput type="password" placeholder="Password" />
          </label>
          <label className="flex flex-col">Reenter Password:
            <SimpleInput type="repassword" placeholder="Password" />
          </label>
          <Button type="submit">Register</Button>
        </form>

        <div className="flex gap-4 mt-6 items-center justify-center">
          <HighlightLink href="/login">Login</HighlightLink>
        </div>
      </main>
    </>
  );
}
