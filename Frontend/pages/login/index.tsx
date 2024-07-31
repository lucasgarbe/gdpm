import ky from "ky";
import Head from "next/head";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";

type JWTToken = {
  access: string
  refresh: string
}

export default function Login() {
  const { login } = useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("submit")

    login({username: "admin", password: "admin"})

    // const tokens = await ky.post("http://localhost:8000/api/token/", {
    //   json: {
    //     username: "admin",
    //     password: "admin"
    //   }
    // }).json() as JWTToken


    // if (tokens) {
    //   console.log("tokens", tokens)

    //   localStorage.setItem("access", tokens.access)
    //   localStorage.setItem("refresh", tokens.refresh)
    // }
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
