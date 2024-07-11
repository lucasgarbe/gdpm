import { XMarkIcon } from "@heroicons/react/24/outline";
import { Props } from "next/script";
import {
  Context,
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";
import { SimpleButton } from "./ButtonsAndLinks";

const useModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState("top");
  const [modalContent, setModalContent] = useState("modal");

  const openModal = (position: "top" | "bottom" = "top", content: any) => {
    setShowModal(true);
    if (content && position) {
      setModalContent(content);
      setModalPosition(position);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return { showModal, openModal, closeModal, modalContent, modalPosition };
};

export type ModalContextType = {
  showModal: boolean;
  openModal: (position: "top" | "bottom", content?: ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode;
  modalPosition: "top" | "bottom";
};
let ModalContext = createContext<ModalContextType | null>(null);

const ModalProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const { showModal, openModal, closeModal, modalContent, modalPosition } =
    useModal();

  return (
    <ModalContext.Provider
      value={{ showModal, openModal, closeModal, modalContent, modalPosition }}
    >
      {children}
      <Modal />
    </ModalContext.Provider>
  );
};

const Modal: FC = () => {
  const { showModal, modalContent, closeModal, modalPosition } = useContext(
    ModalContext
  ) as ModalContextType;
  console.log("Modal component", showModal);

  if (!showModal) return <></>;

  return (
    <div className={`fixed top-0 right-0 bottom-0 left-0 z-20 backdrop-blur`}>
      <div
        className={`fixed z-50 ${modalPosition}-20 left-1/2 -translate-x-1/2 w-1/2 bg-stone-100 p-4 border-2 border-black shadow-harder`}
      >
        <div className="absolute -top-[2px] -right-[2px]">
          <SimpleButton onClick={closeModal}>
            <XMarkIcon className="w-5" />
          </SimpleButton>
        </div>
        {modalContent}
      </div>
    </div>
  );
};

export { Modal, ModalProvider, ModalContext, useModal };
