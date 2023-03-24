import { CodeBracketIcon } from "@heroicons/react/24/outline";

export default function PyMCButton({ toggleModal }: any) {
  return (
    <button
      className="flex gap-1 p-1 bg-gray-100 hover:bg-gray-200 rounded"
      onClick={toggleModal}
    >
      <CodeBracketIcon className="w-5" />
      Download
    </button>
  );
}
