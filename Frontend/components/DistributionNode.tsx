import { memo, useEffect, useState } from "react";
import { Position, useEdges, useNodes } from "reactflow";
import { validate } from "../internal/validate";
import { portSpec } from "../types/portSpec";
import CustomHandle from "./customHandle";
import Link from "next/link";

const DistributionNode = memo(({ id, data, selected }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [color, setColor] = useState("stone");
  const nodes = useNodes();
  const edges = useEdges();

  useEffect(() => {
    console.log("effect", data.dist.distType);
    switch (data.dist.distType) {
      case "continuous":
        setColor("amber");
        break;
      case "discrete":
        setColor("blue");
        break;
    }
  }, [data.dist.distType]);

  return (
    <div className="flex">
      {selected && (
        <div className="absolute -top-10 flex gap-2 rounded bg-gray-50 border border-gray-100">
          <button className="p-1">delete</button>
          <button
            onClick={() => {
              setShowModal(true);
            }}
          >
            info
          </button>
          {showModal && (
            <div
              className="overflow-auto p-1 absolute top-24 w-64 h-96 border border-blue-600 bg-blue-200"
              onClick={() => setShowModal(false)}
            >
              <div className="pb-2 overflow-auto">{data.dist.distType}</div>
              <div className="overflow-auto p-1">
                <Link href={data.dist.url} target="_blank">
                  {data.dist.url}
                </Link>
              </div>
              <ul>
                {data.dist.input.map((input: any, index: number) => (
                  <li key={index}>
                    <div className="p-1">
                      <p>id:</p> {input.id}
                    </div>
                    <div className="p-1">
                      <p>name:</p> {input.name}
                    </div>
                    <div className="p-1">
                      <p>type:</p> {input.type}
                    </div>
                    <div className="p-1">
                      <p>upper:</p> {input.upper}
                    </div>
                    <div className="p-1">
                      <p>lower:</p> {input.lower}
                    </div>
                    <hr className="border-b border-blue-600 my-4"></hr>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {data.dist.input && (
        <div className="flex flex-col justify-center gap-1 py-1">
          {data.dist.input?.map((input: portSpec, index: number) => (
            <CustomHandle
              type="target"
              key={index}
              id={input.id}
              portSpec={input}
              position={Position.Left}
              optional={input.optional}
              isConnectableStart={false}
            ></CustomHandle>
          ))}
        </div>
      )}

      <div
        className={`bg-${color}-200 border border-${color}-600 p-1 flex flex-col justify-center`}
      >
        <p className="text-sm font-semibold mb-auto">{data.dist.displayName}</p>
        <p className="text-xxs mt-2">{data.dist.displayName}</p>
        <p className="text-xxs">{id}</p>
      </div>

      {data.dist.output && (
        <div className="flex flex-col justify-center py-1">
          <CustomHandle
            type="source"
            key="support"
            id={data.dist.output.id}
            portSpec={data.dist.output}
            position={Position.Right}
            optional={false}
            isValidConnection={(connection) =>
              validate(connection, nodes, edges)
            }
            isConnectable={false}
            className={"w-full h-full"}
          ></CustomHandle>
        </div>
      )}
    </div>
  );
});

DistributionNode.displayName = "DistributionNode";
export default DistributionNode;
