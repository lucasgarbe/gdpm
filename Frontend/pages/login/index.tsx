import Link from "next/link";
import Layout from "../../components/Layout";
import { useStore } from "../../hooks/useStore";
import authStore  from "../../stores/auth";

type JWTToken = {
  access: string
  refresh: string
}

export default function Login() {
  const store = useStore(authStore, (state) => state);

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log("submit", event)

    // get inputs from form
    const username = event.target[0].value
    const password = event.target[1].value

    store.login({ username, password })
  }

  return (
    <Layout>
      <main className="container mx-auto flex-grow">

        <form className="max-w-md mx-auto flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
          <label className="flex flex-col">Username:
            <input type="text" placeholder="Username" />
          </label>
          <label className="flex flex-col">Password:
            <input type="password" placeholder="Password" />
          </label>
          <button type="submit">Login</button>
        </form>

        <div className="flex gap-4 mt-6 items-center justify-center">
          <Link href="/register">Register</Link>
        </div>
      </main>
    </Layout>
  );
}
