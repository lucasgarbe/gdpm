import { Handle, HandleProps } from "reactflow";

const CustomHandle = ({
  type,
  position,
  isValidConnection,
  portSpec,
  optional,
}: HandleProps & {
  key: string | number;
  portSpec: any;
  className?: string;
  optional: boolean;
}) => {
  const optionalClass = optional ? " border-b-2 border-b-red-500" : "";
  return (
    <div>
      <Handle
        type={type}
        id={portSpec.id}
        position={position}
        isValidConnection={isValidConnection}
        className={
          "!relative !top-0 !left-0 !right-0 !translate-x-0 min-w-full !bg-black text-white text-[.4rem] p-1 dark:border-white dark:border" +
          optionalClass
        }
      >
        {portSpec.id}
      </Handle>
      <pre className="text-[.3rem]">{portSpec.type}</pre>
    </div>
  );
};

export default CustomHandle;
