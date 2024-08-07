import { useQuery } from "@tanstack/react-query";
import useAPI from "../useAPI";

const fetchModels = async () => {
  console.log("fetch d", process.env.NEXT_PUBLIC_API_URL);
  const models = await api(`${process.env.NEXT_PUBLIC_API_URL}/models/`).json();
  return models;
};


// const usefetchUserModels = async (user_id: Number) => {
//   const api = useAPI();
//   console.log("fetch user models", process.env.NEXT_PUBLIC_API_URL);
//   const user = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${user_id}/`).json();
//   console.log("user", user);
//   const model_ids = user.gdpm_models;
//   console.log("model_ids", model_ids);
//   const models = await Promise.all(model_ids.map(async (model_id: Number) => {
//     return await api.get(`${process.env.NEXT_PUBLIC_API_URL}/models/${model_id}/`).json();
//   }));
//   console.log("models", models);
//   return models;
// }

const useModels = () => {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => fetchModels(),
    staleTime: 1000 * 60 * 5,
  });
};


const useUserModels = (user_id: Number) => {
  const api = useAPI();

  const fetchUserModels = async () => {
    console.trace("fetch user models", user_id);
    const models = await api.get(`users/${user_id}/models/`).json();
    return models;
  }

  return useQuery({
    queryKey: ["models", "user-models", user_id],
    queryFn: () => fetchUserModels(),
    staleTime: 1000 * 60 * 5,
    enabled: !!user_id,
  });
};

const usePublicModels = () => {
  const api = useAPI();

  const fetchPublicModels = async () => {
    const models = await api.get("models/").json();
    return models;
  }

  return useQuery({
    queryKey: ["models", "public-models"],
    queryFn: () => fetchPublicModels(),
    staleTime: 1000 * 60 * 5,
  });
}

export { fetchModels, useModels, useUserModels, usePublicModels };
