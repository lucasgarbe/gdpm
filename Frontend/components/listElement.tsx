import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "./ButtonsAndLinks";
import ky from "ky";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function ListElement({ model }: any) {
  console.log(model);
  console.log(process.env.NEXT_PUBLIC_API_URL);
  console.log(process.env.NEXT_PUBLIC_IMAGE_URL);
  const [showJobs, setShowJobs] = useState(false);

  function handleRunModel() {
    console.log("should run model");
    const formData = new FormData();
    formData.append("status", "frontend");
    formData.append("model", model.id);
    ky.post(`${process.env.NEXT_PUBLIC_API_URL}/job/`, {body: formData});
  }

  return (
    <div>
      <div className="w-full flex justify-between gap-4">
        <Link
          href={`/model/${model?.id}`}
          className="w-full flex justify-between p-3 border-2 border-black hover:shadow-hard hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all ease-in-out duration-75"
        >
          <p className="text-2xl">{model?.title}</p>
        </Link>

        <Button onClick={handleRunModel}>
          Run Model
        </Button>

        <Button
          onClick={() => {
            console.log("should delete");
          }}
          size="small"
        >
          <TrashIcon className="w-5" />
          Delete
        </Button>

        <Button onClick={() => setShowJobs(!showJobs)}>
          Show Jobs
        </Button>

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
      return await response.json();
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
          {data.map((job: any) => (
            <div key={job.id}>
              <div className="grid grid-cols-3 gap-10">
                <p>{job.id}</p>
                <p>{job.status}</p>
                <p className="text-right">{new Date(job.start_time).toLocaleString()}</p>
              </div>
              <img className="w-1/2" src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${model_id}/${job.id}/trace.png`} alt="" />
            </div>
          ))}
        </div>
      ) : (
        <div>No jobs found</div>
      )}
    </div>
  );
}
