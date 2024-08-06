import Link from "next/link";
import { DocumentDuplicateIcon, EyeIcon, PlayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "./ButtonsAndLinks";
import ky from "ky";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DeleteButton from "./DeleteButton";
import useAPI from "../hooks/useAPI";

export default function ListElement({ model }: any) {
  const [showJobs, setShowJobs] = useState(false);
  const api = useAPI();

  function handleRunModel() {
    const formData = new FormData();
    formData.append("status", "frontend");
    formData.append("model", model.id);
    api.post(`job/`, {body: formData});
  }

  function handleDuplicateModel() {
    api.post(`models/${model.id}/duplicate/`);
  }

  return (
    <div className={`p-3 border-2 border-black transition-all ease-in-out duration-75 ${showJobs ? 'shadow-hard': '' }`}>
      <div className="w-full flex justify-between gap-4">
        <Link
          href={`/model/${model?.id}`}
          className="w-full"
        >
          <p className="text-2xl">{model?.title}</p>
        </Link>

        <Button onClick={handleRunModel}>
          <PlayIcon className="w-5" />
        </Button>

        <Button onClick={() => setShowJobs(!showJobs)}>
          <EyeIcon className="w-5" />
        </Button>

        <Button onClick={handleDuplicateModel}>
          <DocumentDuplicateIcon className="w-5" />
        </Button>

        <DeleteButton id={model.id} />
      </div>

      { showJobs ? ( <JobList model_id={model.id} />) : null }
    </div>
  );
}

function JobList({ model_id }: {model_id: string}) {
  const {isPending, error, data, isFetching}  = useQuery({
    queryKey: ["jobs", model_id],
    queryFn: async () => {
      const response = await ky.get(`${process.env.NEXT_PUBLIC_API_URL}/job/`);
      const jobs = await response.json() as any[];
      jobs.reverse();
      return jobs;
    }
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error </p>;
  }

  // create date object from end_time and format to european date
  // const formattedData = data.map((job: any) => {
  //  const date = new Date(job.end_time);
  //  return {...job, end_time: date.toLocaleDateString()};
  //

  return (
    <div>
      {data && data.length > 0 ? (
        <div>
          <p className="text-xl">Jobs:</p>
          {data.map((job: any) => (
            <JobElement key={job.id} job={job} model_id={model_id} />
          ))}
        </div>
      ) : (
        <div>No jobs found</div>
      )}
    </div>
  );
}

function JobElement({ job, model_id }: any) {
  const [open, setOpen] = useState(false);
  const {isPending, error, data, isFetching}  = useQuery({
    queryKey: ["log", model_id, job.id],
    queryFn: async () => {
      const response = await ky.get(`${process.env.NEXT_PUBLIC_IMAGE_URL}/${model_id}/${job.id}/model.log`);
      const log = await response.text();
      return log;
    }
  });

  return (
    <div onClick={() => {setOpen(!open)}} className="odd:bg-stone-200 even:bg-stone-300 p-2">
      <div className="grid grid-cols-3 gap-10 cursor-pointer">
        <p>{job.id}</p>
        <p>{job.status}</p>
        <p className="text-right">{new Date(job.start_time).toLocaleString()}</p>
      </div>
      {open ? (
        <div className="py-4">
          <img className="w-1/2" src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${model_id}/${job.id}/trace.png`} alt="" />
          
        </div>
      ) : null}
    </div>
  );
}

