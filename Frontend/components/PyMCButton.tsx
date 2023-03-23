import { CodeBracketIcon } from "@heroicons/react/24/outline";

export default function PyMCButton({ toggleModal }: any) {
  return (
    <button className="p-1 hover:bg-gray-200 rounded" onClick={toggleModal}>
      <CodeBracketIcon className="w-5" />
    </button>
  );
}
