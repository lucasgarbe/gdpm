import Link from "next/link";
import { HighlightLink } from "./ButtonsAndLinks";

export default function Header() {
  return (
    <header className="container mx-auto py-1 border-b-2 border-black flex justify-between items-center">
      <Link href="/">
        <h1 className="font-bold text-4xl py-2">gdpm</h1>
      </Link>

      <nav className="flex gap-6">
        <HighlightLink href="/models/new">New Model</HighlightLink>
        <HighlightLink href="/models">List all Models</HighlightLink>
      </nav>
    </header>
  );
}
