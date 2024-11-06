import Link from "next/link";
import { HighlightLink, Button } from "../../components/ButtonsAndLinks";
import Layout from "../../components/Layout";
import SimpleInput from "../../components/SimpleInput";
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

        <form className="max-w-md mx-auto flex flex-col items-center gap-4 mt-6" onSubmit={handleSubmit}>
          <label className="flex flex-col">Username:
            <SimpleInput name="username" type="text" placeholder="Username" />
          </label>
          <label className="flex flex-col">Password:
            <SimpleInput name="password" type="password" placeholder="Password" />
          </label>
          <Button type="submit">Login</Button>
        </form>

        <div className="flex gap-4 mt-6 items-center justify-center">
          <HighlightLink href="/register">Register</HighlightLink>
        </div>
      </main>
    </Layout>
  );
}
