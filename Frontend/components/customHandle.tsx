import { Handle, HandleProps } from "reactflow";

const CustomHandle = ({
  type,
  key,
  position,
  isValidConnection,
  name,
}: HandleProps & { key: string | number; name: string }) => (
  <Handle
    type={type}
    key={key}
    position={position}
    isValidConnection={isValidConnection}
    className={
      "min-w-full bg-black text-white text-[.4rem] p-1 dark:border-white dark:border"
    }
  >
    {name}
  </Handle>
);

export default CustomHandle;
