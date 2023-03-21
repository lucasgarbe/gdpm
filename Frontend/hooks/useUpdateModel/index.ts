import { useMutation, useQuery } from "@tanstack/react-query";
import ky from "ky-universal";

type updatePayload = {
  id: number;
  title: string;
  body: object;
};

const useUpdateModel = () => {
  return useMutation({
    mutationFn: (payload: updatePayload) => {
      return ky
        .post(`${process.env.NEXT_PUBLIC_API_URL}/models/`, {
          json: payload,
        })
        .json();
    },
  });
};

export { useUpdateModel };
