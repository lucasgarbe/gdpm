import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CloudIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import useAPI from "../hooks/useAPI";
import { Button } from "./ButtonsAndLinks";

export default function DeleteButton({ id }: any) {
  const router = useRouter();
  const [defaultButton, setDefaultButton] = useState(true);
  const queryClient = useQueryClient();
  const api = useAPI();
  const deleteModelMutation = useMutation({
    mutationFn: (payload: any) => {
      return api
        .delete(`models/${payload.id}/`, {
        })
        .json();
    },
    onMutate: () => {
      setDefaultButton(false);
    },
    onError: () => {},
    onSuccess: () => {
      queryClient.refetchQueries({queryKey: ["models"]});
    },
  });

  const handleDelete = useCallback(() => {
    console.log("deleting", id);
    deleteModelMutation.mutate({ id });
  }, [id, deleteModelMutation]);

  return (
    <Button onClick={handleDelete} size="small">
      {defaultButton ? (
        <>
          <TrashIcon className="w-5" />
          Delete
        </>
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
    </Button>
  );
}
