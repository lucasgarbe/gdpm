import { useMutation, useQuery } from "@tanstack/react-query";
import ky from "ky-universal";

type updatePayload = {
  title: string;
  body: object;
};

const useUpdateModel = () => {
  return useMutation({
    mutationFn: (payload: updatePayload) => {
      return ky
        .patch(`${process.env.NEXT_PUBLIC_API_URL}/${payload.title}/models/`, {
          json: payload,
        })
        .json();
    },
  });
};

export { useUpdateModel };
