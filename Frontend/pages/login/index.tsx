import ky from "ky";
import Head from "next/head";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";

type JWTToken = {
  access: string
  refresh: string
}

export default function Login() {
  const { login, error } = useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("submit", event)

    // get inputs from form
    const username = event.target[0].value
    const password = event.target[1].value

    login({username, password})
  }

  const verifyToken = async () => {
    const token = localStorage.getItem("access")

    if (token) {
      const response = await ky.post("http://localhost:8000/api/token/verify/", {
        json: {
          token: token
        }
      }).json()
    }
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
        <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
        <button onClick={verifyToken}>Verify Token</button>
      </main>
    </>
  );
}
