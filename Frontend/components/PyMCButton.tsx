import { CodeBracketIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

export default function PyMCButton({ toggleModal }: any) {
  return (
    <Button onClick={toggleModal}>
      <CodeBracketIcon className="w-5" />
      Download
    </Button>
  );
}
