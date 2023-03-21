import { ArrowPathIcon, CloudArrowDownIcon } from "@heroicons/react/24/outline";
import { CloudIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import ky from "ky-universal";
import { useCallback, useState } from "react";

export default function SaveButton({ reactFlowInstance, modelname }: any) {
  const [defaultButton, setDefaultButton] = useState(true);
  const updateModelMutation = useMutation({
    mutationFn: (payload: any) => {
      if (!payload.id) {
        return ky
          .post(`${process.env.NEXT_PUBLIC_API_URL}/models/`, {
            json: payload,
          })
          .json();
      }

      return ky
        .put(`${process.env.NEXT_PUBLIC_API_URL}/models/${modelname}/`, {
          json: payload.body,
        })
        .json();
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
        title: modelname,
        body: flow,
      });
    }
  }, [modelname, reactFlowInstance]);

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
