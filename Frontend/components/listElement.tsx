import Link from "next/link";
import ArrowLeft from "../components/arrow-left";

// interface SidebarProps {
//     className: string;
// }

export default function ListElement() {
    // const onDragStart= (event: any, nodeType: string): void => {
    //     if (event.dataTransfer === null) return;
    //     event.dataTransfer.setData('application/reactflow', nodeType);
    //     event.dataTransfer.effectAllowed = 'move';
    // };

    return (
        <div className={`${className} bg-gray-100 dark:bg-gray-900 h-full p-2`}>
            // <div className="flex gap-4 items-center mb-4">
            //     <Link href="/"><ArrowLeft /></Link>
            //     <h1 className="text-2xl">Modelname</h1>
            // </div>

            // <div className="node-list flex flex-col gap-4">
            //     <div
            //         className="node cursor-pointer p-1 bg-white dark:bg-black border rounded border-black text-center"
            //         onDragStart={(event) => onDragStart(event, 'input')}
            //         draggable>
            //         Input
            //     </div>
            //
            //     <div
            //         className="node cursor-pointer p-1 bg-white dark:bg-black border rounded border-black text-center"
            //         onDragStart={(event) => onDragStart(event, 'normal')}
            //         draggable>
            //         Normal
            //     </div>
            //
            //     <div
            //         className="node cursor-pointer p-1 bg-white dark:bg-black border rounded border-black text-center"
            //         onDragStart={(event) => onDragStart(event, 'output')}
            //         draggable>
            //         Output
            //     </div>
            // </div>
        </div>
    )
}
