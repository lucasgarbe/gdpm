import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CloudIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import ky from "ky-universal";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export default function DeleteButton({ reactFlowInstance, modelname }: any) {
  const router = useRouter();
  const [defaultButton, setDefaultButton] = useState(true);
  const deleteModelMutation = useMutation({
    mutationFn: (payload: any) => {
      return ky
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/models/${payload.title}/`)
        .json();
    },
    onMutate: () => {
      setDefaultButton(false);
    },
    onError: () => {},
    onSuccess: () => {
      router.push("/models");
    },
  });

  const handleDelete = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      console.log("saving", flow);
      deleteModelMutation.mutate({
        title: modelname,
        body: flow,
      });
    }
  }, [modelname, reactFlowInstance, deleteModelMutation]);

  return (
    <button className="p-1 hover:bg-gray-200 rounded" onClick={handleDelete}>
      {defaultButton ? (
        <TrashIcon className="w-5" />
      ) : (
        <>
          {deleteModelMutation.isLoading && <ArrowPathIcon className="w-5" />}
          {deleteModelMutation.isError && (
            <ExclamationTriangleIcon className="w-5 text-red-500" />
          )}
          {deleteModelMutation.isSuccess && (
            <CloudIcon className="w-5 text-green-500" />
          )}
        </>
      )}
    </button>
  );
}
