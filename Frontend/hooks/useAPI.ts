import ky from "ky";
import useAuth from "./useAuth";

export default function useAPI() {
  const { refresh } = useAuth();

  const api = ky.extend({
    prefixUrl: process.env.NEXT_PUBLIC_API_URL,
    hooks: {
      beforeRequest: [
        async (request) => {
          let token = localStorage.getItem("access");
          const accessExpires = localStorage.getItem("access_expires");

          if (token && accessExpires && Date.now() >= parseInt(accessExpires) * 1000) {
            refresh();
            token = localStorage.getItem("access");
          }

          if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
          }
        },
      ],
    },
  });

  return api;
}
