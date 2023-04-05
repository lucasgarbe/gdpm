import Link from "next/link";
import { MouseEventHandler, ReactNode } from "react";

export const Button = ({
  children,
  onClick,
  size,
}: {
  children: ReactNode;
  onClick?: MouseEventHandler;
  size?: "small";
}) => {
  return (
    <button
      className={`flex gap-1 items-center bg-stone-100 border-2 border-black hover:shadow-hard hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all ease-in-out duration-75  ${
        size == "small" ? "p-1" : "px-4 py-2"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const SimpleButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: MouseEventHandler;
}) => {
  return (
    <button
      className={`flex gap-1 items-center p-1 bg-stone-100 border-2 border-black hover:bg-black hover:text-stone-100 transition-all ease-in-out duration-75`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const HighlightLink = ({
  href,
  children,
  size,
}: {
  href: string;
  children: ReactNode;
  size?: "small" | undefined;
}) => (
  <Link
    href={href}
    className={`flex items-center border-2 border-black font-semibold bg-stone-100 hover:shadow-hard hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all ease-in-out duration-75 ${
      size == "small" ? "p-1" : "px-4 py-2"
    }`}
  >
    {children}
  </Link>
);
