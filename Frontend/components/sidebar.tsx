import { dehydrate, QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import ArrowLeft from "../components/arrow-left";
import {
  fetchDistributions,
  useDistributions,
} from "../hooks/useDistributions";

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { data, isLoading } = useDistributions();

  const onDragStart = (event: any, nodeType: string, dist: Object): void => {
    if (event.dataTransfer === null) return;
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: nodeType, dist: dist })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  if (isLoading) return <div>Loading</div>;

  return (
    <div className={`${className} bg-gray-100 dark:bg-gray-900 h-full p-2`}>
      <div className="flex gap-4 items-center mb-4">
        <Link href="/">
          <ArrowLeft />
        </Link>
        <h1 className="text-2xl">Modelname</h1>
      </div>

      <div className="node-list flex flex-col gap-4">
        {data?.map((dist, index) => (
          <div
            className="node cursor-pointer p-1 bg-white dark:bg-black border rounded border-black text-center"
            onDragStart={(event) => onDragStart(event, "distribution", dist)}
            draggable
            key={index}
          >
            {dist.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["distributions"],
    queryFn: () => fetchDistributions(),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
