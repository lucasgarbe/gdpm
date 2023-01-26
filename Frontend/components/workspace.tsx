import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Controls,
    Background,
    MiniMap,
    Edge,
    Node,
    NodeChange,
    applyNodeChanges,
    applyEdgeChanges,
    EdgeChange,
    Connection,
} from 'reactflow';
import DistributionNode from '../components/distributionNode';
import 'reactflow/dist/style.css';

interface WorkspaceProps {
    className: string;
}

const initialNodes = [];

let id = 0;
const getId = () => `node_${id++}`;

const nodeTypes = {
    distribution: DistributionNode,
}

export default function Workspace({ className }: WorkspaceProps) {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    
    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    
    const onDrop = useCallback(
        (event: any) => {
            event.preventDefault();
            
            if (reactFlowWrapper.current === null) return;
            const wrapper = reactFlowWrapper.current as any;
            const reactFlowBounds = wrapper.getBoundingClientRect();
            const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            console.log(data);
            
            // check if the dropped element is valid
            if (typeof data.type === 'undefined' || !data.type) {
                return;
            }
            
            if (reactFlowInstance === null) return;
            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: getId(),
                type: data.type,
                position,
                data: { dist: data.dist },
            };
            
            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    return (
        <div className={className} ref={reactFlowWrapper}>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    )
}
