import { ArrowPathIcon, CloudArrowDownIcon } from "@heroicons/react/24/outline";
import { CloudIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import ky from "ky-universal";
import { useCallback, useState } from "react";

export default function SaveButton({ reactFlowInstance }: any) {
  const [defaultButton, setDefaultButton] = useState(true);
  const updateModelMutation = useMutation({
    mutationFn: (payload: any) => {
      return ky.put("http://httpbin.org/anything", { json: payload }).json();
      // return ky
      //   .post(`${process.env.NEXT_PUBLIC_API_URL}/models/`, {
      //     json: payload,
      //   })
      //   .json();
    },
    onMutate: () => {
      setDefaultButton(false);
    },
    onSettled: () => {
      setTimeout(() => {
        setDefaultButton(true);
      }, 1000);
    },
  });
  const handleSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      console.log("saving", flow);
      updateModelMutation.mutate({
        title: "test",
        body: flow,
      });
    }
  }, [reactFlowInstance]);

  return (
    <button className="p-1 hover:bg-gray-200 rounded" onClick={handleSave}>
      {defaultButton ? (
        <CloudArrowDownIcon className="w-5" />
      ) : (
        <>
          {updateModelMutation.isLoading && <ArrowPathIcon className="w-5" />}
          {updateModelMutation.isError && (
            <ExclamationTriangleIcon className="w-5 text-red-500" />
          )}
          {updateModelMutation.isSuccess && (
            <CloudIcon className="w-5 text-green-500" />
          )}
        </>
      )}
    </button>
  );
}
