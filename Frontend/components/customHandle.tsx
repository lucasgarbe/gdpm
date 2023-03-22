import { Handle, HandleProps } from "reactflow";

const CustomHandle = ({
  type,
  position,
  isValidConnection,
  name,
}: HandleProps & {
  key: string | number;
  name: string;
  className?: string;
}) => (
  <Handle
    type={type}
    id={name}
    position={position}
    isValidConnection={isValidConnection}
    className={
      "!relative !top-0 !left-0 !right-0 !translate-x-0 min-w-full !bg-black text-white text-[.4rem] p-1 dark:border-white dark:border"
    }
  >
    {name}
  </Handle>
);

export default CustomHandle;
