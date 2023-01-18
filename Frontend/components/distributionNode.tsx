import { memo } from 'react';
import { Handle, Position } from 'reactflow';


export default memo(({ data }) => {

    return (
        <>
            <div className="border border-blue-600 bg-blue-200 rounded px-8 py-4">
                {data.dist.inputs && 
                    <div className="absolute top-0 left-0 -translate-x-1/2 flex flex-col justify-around h-full">
                        {data.dist.inputs?.map((input, index) => (
                            <div class="relative bg-black text-white text-[.4rem] p-1 rounded">
                                <Handle type="target" position={Position.Left} key={index} />
                                {input.name}
                            </div>
                        ))}
                    </div>
                }

                <div>
                    <p className="font-bold text-md">{data.dist.name}</p>
                </div>

                {data.dist.output && 
                    <div className="absolute top-0 right-0 translate-x-1/2 flex flex-col justify-around h-full">
                        <div class="relative bg-black text-white text-[.4rem] p-1 rounded">
                            <Handle type="source" position={Position.Right} />
                            {data.dist.output.name}
                        </div>
                    </div>
                }
            </div>
        </>
    );
});
