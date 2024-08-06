import Link from "next/link";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useUser } from "../hooks/useTokens";
import authStore from "../stores/auth";
import { HighlightLink } from "./ButtonsAndLinks";
import LoginButton from "./loginButton";

export default function Header() {
  // const { user } = useAuth();
  // const { user } = authStore();
  // const { user } = useUser();

  const [user, setUser] = useState(null);
  const store = authStore();

  useEffect(() => {
    setUser(store.user);
  }, [store]);

  return (
    <header className="container mx-auto py-1 border-b-2 border-black flex justify-between items-center">
      <Link href="/">
        <h1 className="font-bold text-4xl py-2 bg-gradient-to-r from-indigo-500 to-amber-500 bg-clip-text text-transparent">
          gdpm
        </h1>
      </Link>

      <nav className="flex gap-6 bg-gradient-1">
        <HighlightLink href="/models/new">New Model</HighlightLink>

        {user && (
          <>
            <HighlightLink href="/models">List my Models</HighlightLink>
            <HighlightLink href="/config">Edit config</HighlightLink>
          </>
        )}
        <LoginButton />
      </nav>
    </header>
  );
}
