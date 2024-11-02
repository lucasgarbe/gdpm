import Link from "next/link";
import { DocumentDuplicateIcon, EyeIcon, PlayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "./ButtonsAndLinks";
import ky from "ky";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteButton from "./DeleteButton";
import useAPI from "../hooks/useAPI";

export default function ListElement({ model }: any) {
  const [showJobs, setShowJobs] = useState(false);
  const api = useAPI();
  const queryClient = useQueryClient();

  function handleRunModel() {
    const formData = new FormData();
    formData.append("status", "frontend");
    formData.append("model", model.id);
    api.post(`job/`, {body: formData});
  }

  async function handleDuplicateModel() {
    await api.get(`models/${model.id}/duplicate/`);
    queryClient.invalidateQueries({ queryKey: ["models"] });
  }

  return (
    <div className={`p-3 border-2 border-black transition-all ease-in-out duration-75 ${showJobs ? 'shadow-hard': '' }`}>
      <div className="w-full flex justify-between gap-4">
        <Link
          href={`/model/${model?.id}`}
          className="w-full"
        >
          <p className="text-2xl font-medium">{model?.title}</p>
          <p className="text-sm">{model?.owner}</p>
          <p className="text-sm">last changed at: {new Date(model?.changed_at).toLocaleString()} and created {new Date(model?.created).toLocaleDateString()}</p>
        </Link>

        <div className="flex gap-4 items-start">
          <Button onClick={handleRunModel} size="small">
            <PlayIcon className="w-5" />
          </Button>

          <Button onClick={() => setShowJobs(!showJobs)} size="small">
            <EyeIcon className="w-5" />
          </Button>

          <Button onClick={handleDuplicateModel} size="small">
            <DocumentDuplicateIcon className="w-5" />
          </Button>

          <DeleteButton id={model.id} />
        </div>
      </div>

      { showJobs ? ( <JobList model={model} />) : null }
    </div>
  );
}

function JobList({ model }) {
  const api = useAPI();
  const {isPending, error, data, isFetching}  = useQuery({
    queryKey: ["jobs", model.id],
    queryFn: async () => {
      const response = await api.get(`models/${model.id}/jobs`);
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
            <JobElement key={job.id} job={job} model_id={model.id} />
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
      const response = await ky.get(`${process.env.NEXT_PUBLIC_IMAGE_URL}/${model_id}/${job.id}/output.log`);
      const log = await response.text();
      return log;
    },
    retry: 1,
  });

  return (
    <div onClick={() => {setOpen(!open)}} className="odd:bg-stone-200 even:bg-stone-300 p-2">
      <div className="grid grid-cols-3 gap-10 cursor-pointer">
        <p>{job.id}</p>
        <p>{job.status}</p>
        <p className="text-right">{new Date(job.start_time).toLocaleString()}</p>
      </div>
      {open ? (
        <div className="grid grid-cols-2 gap-4 py-4">
          <img className="w-full font-mono" src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${model_id}/${job.id}/trace.png`} alt="" />

          {data ? (
            <pre class="w-full overflow-x-scroll bg-white">{data}</pre>
          ) : error ? (
            <p>Error loading output.log</p>
          ) : (
            <p>Loading output.log ...</p>
          )}

        </div>
      ) : null}
    </div>
  );
}

