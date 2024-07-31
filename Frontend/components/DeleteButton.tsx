import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CloudIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky-universal";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import useAPI from "../hooks/useAPI";
import useAuth from "../hooks/useAuth";
import { Button } from "./ButtonsAndLinks";

export default function DeleteButton({ id }: any) {
  const router = useRouter();
  const [defaultButton, setDefaultButton] = useState(true);
  const queryClient = useQueryClient();
  const api = useAPI();
  const deleteModelMutation = useMutation({
    mutationFn: (payload: any) => {
      return api
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/models/${payload.id}/`, {
          headers: {
            "Authorization": `Bearer ${user?.access}`,
          },
        })
        .json();
    },
    onMutate: () => {
      setDefaultButton(false);
    },
    onError: () => {},
    onSuccess: () => {
      router.push("/models");
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
