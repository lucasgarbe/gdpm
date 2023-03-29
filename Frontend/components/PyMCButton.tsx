import { CodeBracketIcon } from "@heroicons/react/24/outline";
import { Button } from "./ButtonsAndLinks";

export default function PyMCButton({ toggleModal }: any) {
  return (
    <Button onClick={toggleModal} size="small">
      <CodeBracketIcon className="w-5" />
      Download
    </Button>
  );
}
