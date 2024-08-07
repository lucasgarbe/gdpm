import { jwtDecode } from "jwt-decode";
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
          console.log('ky beforeRequest', request, store);
          if (store) {
            // const expires = store.expires;
            // const now = Date.now();
            // const refreshToken = store.refresh;

            // // check if token is expired
            // if (refreshToken && now >= expires) {
            //   console.log("found expired acces token and refresh token", now, expires, now >= expires);
            //   // fetch new token
            //   try {
            //     const response = await ky.post(`${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`, { json: { refresh: refreshToken } }).json() as { access: string };
            //     console.log("got new access token", response);

            //     store.setAccessToken(response.access);
            //   } catch (error) {
            //     console.error("Failed to refresh token:", error);
            //   }
            // }

            await store.fetchRefresh();

            // return acces from fetchRefresh and set/use manually
            // console.log("new store in ky hook", store, store.access, store.expires);
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
