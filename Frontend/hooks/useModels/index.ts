import ky from "ky-universal";
import { useQuery } from "@tanstack/react-query";

const fetchModels = async () => {
  console.log("fetch d", process.env.NEXT_PUBLIC_API_URL);
  const models = await ky(`${process.env.NEXT_PUBLIC_API_URL}/models/`).json();
  return models;
};

const fetchUserModels = async (user_id: Number) => {
  console.log("fetch user models", process.env.NEXT_PUBLIC_API_URL);
  const user = await ky(`${process.env.NEXT_PUBLIC_API_URL}/users/${user_id}/`).json();
  console.log("user", user);
  const model_ids = user.gdpm_models;
  console.log("model_ids", model_ids);
  const models = await Promise.all(model_ids.map(async (model_id: Number) => {
    return await ky(`${process.env.NEXT_PUBLIC_API_URL}/models/${model_id}/`).json();
  }));
  console.log("models", models);
  return models;
}

const useModels = () => {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => fetchModels(),
    staleTime: 1000 * 60 * 5,
  });
};


const useUserModels = (user_id: Number) => {
  return useQuery({
    queryKey: ["models", user_id],
    queryFn: () => fetchUserModels(user_id),
    staleTime: 1000 * 60 * 5,
    enabled: !!user_id,
  });
};

export { fetchModels, useModels, useUserModels };
