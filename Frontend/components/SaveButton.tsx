import { ArrowPathIcon, CloudArrowDownIcon } from "@heroicons/react/24/outline";
import { CloudIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky-universal";
import router, { useRouter } from "next/router";
import { useCallback, useState } from "react";
import Button from "./Button";

export default function SaveButton({
  reactFlowInstance,
  modelname,
  lastIndex,
}: any) {
  const [defaultButton, setDefaultButton] = useState(true);
  const router = useRouter();

  const updateModelMutation = useMutation({
    mutationFn: (payload: any) => {
      if (typeof router.query.id === "undefined") {
        return ky
          .post(`${process.env.NEXT_PUBLIC_API_URL}/models/`, {
            json: payload,
          })
          .json();
      }

      return ky
        .put(`${process.env.NEXT_PUBLIC_API_URL}/models/${router.query.id}/`, {
          json: payload,
        })
        .json();
    },
    onMutate: () => {
      setDefaultButton(false);
    },
    onSuccess: (response: any) => {
      setTimeout(() => {
        setDefaultButton(true);
      }, 1000);
      if (typeof router.query.id === "undefined") {
        router.push(`/model/${response.id}`);
      }
    },
  });
  const handleSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      console.log("saving", flow);
      updateModelMutation.mutate({
        title: modelname,
        body: { ...flow, lastIndex },
      });
    }
  }, [modelname, lastIndex, reactFlowInstance, updateModelMutation]);

  return (
    <Button
      className="flex gap-1 p-1 bg-gray-100 hover:bg-gray-200 rounded"
      onClick={handleSave}
    >
      {defaultButton ? (
        <>
          <CloudArrowDownIcon className="w-5" />
          Save
        </>
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
    </Button>
  );
}
