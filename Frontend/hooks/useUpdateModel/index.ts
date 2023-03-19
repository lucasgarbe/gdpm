import { useMutation, useQuery } from "@tanstack/react-query";
import ky from "ky-universal";

type updatePayload = {
  title: string;
  body: object;
};

const useUpdateModel = () => {
  return useMutation({
    mutationFn: (flowObject) => {
      return ky
        .post(`${process.env.NEXT_PUBLIC_API_URL}/models/`, {
          json: flowObject,
        })
        .json();
    },
  });
};

export { useUpdateModel };
