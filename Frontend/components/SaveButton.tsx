import { ArrowPathIcon, CloudArrowDownIcon } from "@heroicons/react/24/outline";
import { CloudIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import ky from "ky-universal";
import router, { useRouter } from "next/router";
import { useCallback, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Button } from "./ButtonsAndLinks";

export default function SaveButton({
  reactFlowInstance,
  modelname,
  lastIndex,
}: any) {
  const [defaultButton, setDefaultButton] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const updateModelMutation = useMutation({
    mutationFn: (payload: any) => {
      if (typeof router.query.id === "undefined") {
        return ky
          .post(`${process.env.NEXT_PUBLIC_API_URL}/models/`, {
            json: payload,
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access")}`,
            }
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
