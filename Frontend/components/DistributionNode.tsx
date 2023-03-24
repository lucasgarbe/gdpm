import {memo, useState} from "react";
import {Position, Node, Connection, useEdges, useNodes} from "reactflow";
import {validate} from "../internal/validate";
import CustomHandle from "./customHandle";
import Link from "next/link";


const DistributionNode = memo(({ data, selected }: any) => {
  const [showModal, setShowModal] = useState(false);
  const nodes = useNodes();
  return (
    <div className="flex">
      {selected && (
        <div className="absolute -top-10 flex gap-2 rounded bg-gray-50 border border-gray-100">
          <button className="p-1">delete</button>
          <button onClick={() => {setShowModal(true)}}>info</button>
         {showModal && ( <div className="overflow-auto p-1 absolute top-24 w-64 h-96 border border-blue-600 bg-blue-200" onClick={() =>setShowModal(false)}>
            <div className="pb-2 overflow-auto">{data.dist.distType}</div>
            <div className="overflow-auto p-1"><Link href={data.dist.url} target="_blank">{data.dist.url}</Link></div>
            <ul>
                    {data.dist.input.map((input, index) => (
                  <div><li className="p-1" key={index}><p>id:</p> {input.id}</li>
                      <li className="p-1" key={index}><p>name:</p> {input.name}</li>
                      <li className="p-1" key={index}><p>type:</p> {input.type}</li>
                      <li className="p-1" key={index}><p>upper:</p> {input.upper}</li>
                      <li className="p-1" key={index}><p>lower:</p> {input.lower}</li>
                      <hr className="border-b border-blue-600 my-4" ></hr>
                      </div>
                    ))}
                </div>
            )}

            <div className="bg-blue-200 border border-blue-600 p-1 flex items-center justify-center">
                <p className="font-bold text-md">{data.dist.displayName}</p>
            </div>

            {data.dist.output && (
                <div className="flex flex-col justify-center py-1">
                    <CustomHandle
                        type="source"
                        key="support"
                        id={data.dist.output.id}
                        portSpec={data.dist.output}
                        position={Position.Right}
                        isValidConnection={(connection) => validate(connection, nodes)}
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
