import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CloudIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import ky from "ky-universal";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export default function DeleteButton({ id }: any) {
  const router = useRouter();
  const [defaultButton, setDefaultButton] = useState(true);
  const deleteModelMutation = useMutation({
    mutationFn: (payload: any) => {
      return ky
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/models/${payload.id}/`)
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
    console.log("deleting", id);
    deleteModelMutation.mutate({ id });
  }, [id, deleteModelMutation]);

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
