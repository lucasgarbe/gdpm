import { XMarkIcon } from "@heroicons/react/24/outline";
import { MouseEventHandler, ReactNode } from "react";
import { Button, SimpleButton } from "./ButtonsAndLinks";

export default function Modal({
  open,
  children,
  close,
}: {
  open: boolean;
  children: ReactNode;
  close: MouseEventHandler;
}) {
  if (!open) return <></>;
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-20 backdrop-blur">
      <div className="fixed z-50 top-20 left-1/2 -translate-x-1/2 w-1/2 bg-stone-100 p-4 border-2 border-black shadow-harder">
        <div className="absolute -top-[2px] -right-[2px]">
          <SimpleButton onClick={close}>
            <XMarkIcon className="w-5" />
          </SimpleButton>
        </div>
        {children}
      </div>
    </div>
  );
}
