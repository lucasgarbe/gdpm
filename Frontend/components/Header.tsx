import Link from "next/link";
import { ReactChild, ReactNode } from "react";

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

const HighlightLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <Link
    href={href}
    className="border-2 border-black px-4 py-2 font-semibold bg-white hover:shadow-hard hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all ease-in-out duration-75"
  >
    {children}
  </Link>
);
