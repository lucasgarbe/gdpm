import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "./ButtonsAndLinks";

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
      <Button
        onClick={() => {
          console.log("should delete");
        }}
        size="small"
      >
        <TrashIcon className="w-5" />
        Delete
      </Button>
    </div>
  );
}
