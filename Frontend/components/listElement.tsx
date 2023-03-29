import Link from "next/link";
import ArrowLeft from "../components/arrow-left";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

export default function ListElement({ model }: any) {
  console.log(model);
  return (
    <div className="w-full flex justify-between gap-4">
      <Link
        href={`/model/${model?.id}`}
        className="w-full flex justify-between p-3 border-2 border-black hover:shadow-hard hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all ease-in-out duration-75"
      >
        <p className="text-2xl">{model?.title}</p>
      </Link>
      <button className="flex items-center p-3 border-2 border-black hover:shadow-hard hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all ease-in-out duration-75">
        <TrashIcon className="h-8 w-8" />
      </button>
      <Button>
        <TrashIcon className="h-8 w-8" />
      </Button>
    </div>
  );
}
