import ky from "ky";
import { useStore } from "../hooks/useStore";
import authStore from "../stores/auth";

export default function useAPI() {
  const store = useStore(authStore, (state) => state);

  const api = ky.extend({
    prefixUrl: process.env.NEXT_PUBLIC_API_URL,
    hooks: {
      beforeRequest: [
        async (request) => {
          console.log('ky beforeRequest', request, {store: store});
          if (store) {
            await store.fetchRefresh();

            console.log("new store in ky hook", store, store.access);
            if (store.access) {
              request.headers.set("Authorization", `Bearer ${store.access}`);
            }
          }
        },
      ],
    },
  });

  return api;
}
