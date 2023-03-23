import Link from "next/link";
import ArrowLeft from "../components/arrow-left";
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function ListElement({model} : any){
  console.log(model);
    return (
        <div className="bg-gray-100 w-full flex justify-between px-14 py-10">
            <p className="text-2xl font-bold">{model?.title}</p>
          <div className="flex gap-4">
            <ArrowUpOnSquareIcon className="h-8 w-8"/>
            <ArrowDownTrayIcon className="h-8 w-8"/>
            <DocumentDuplicateIcon className="h-8 w-8"/>
            <ArchiveBoxIcon className="h-8 w-8"/>
            <TrashIcon className="h-8 w-8"/>
          </div>
          </div>
    )
}
