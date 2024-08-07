import { ArrowPathIcon, CloudArrowDownIcon } from "@heroicons/react/24/outline";
import { CloudIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import useAPI from "../hooks/useAPI";
import useAuth from "../hooks/useAuth";
import { Button } from "./ButtonsAndLinks";

export default function SaveButton({
  reactFlowInstance,
  modelname,
  lastIndex,
}: any) {
  const [defaultButton, setDefaultButton] = useState(true);
  const router = useRouter();
  const api = useAPI();
  const queryClient = useQueryClient();

  const updateModelMutation = useMutation({
    mutationFn: (payload: any) => {
      if (typeof router.query.id === "undefined") {
        return api
          .post(`models/`, {
            json: payload,
          })
          .json();
      }

      return api
        .put(`models/${router.query.id}/`, {
          json: payload,
        })
        .json();
    },
    retry: 1,
    onMutate: () => {
      setDefaultButton(false);
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["models"], refetchType: "all" });
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
    <Button onClick={handleSave} size="small">
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
