import Link from "next/link";
import useAuth from "../hooks/useAuth";
import { HighlightLink } from "./ButtonsAndLinks";
import LoginButton from "./loginButton";

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="container mx-auto py-1 border-b-2 border-black flex justify-between items-center">
      <Link href="/">
        <h1 className="font-bold text-4xl py-2 bg-gradient-to-r from-indigo-500 to-amber-500 bg-clip-text text-transparent">
          gdpm
        </h1>
      </Link>

      <nav className="flex gap-6 bg-gradient-1">
        <HighlightLink href="/models/new">New Model</HighlightLink>
        <HighlightLink href="/models">List all Models</HighlightLink>

        {user && (
          <HighlightLink href="/config">Edit config</HighlightLink>
        )}
        <LoginButton />
      </nav>
    </header>
  );
}
