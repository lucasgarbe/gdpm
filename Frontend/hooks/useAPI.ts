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
          let localStore = JSON.parse(localStorage.getItem('auth'));
          localStore = localStore?.state;
          console.log('ky beforeRequest', request, localStore);
          console.log(localStorage.getItem('auth'));
          if (localStore) {
            const expires = localStore.expires;
            const now = Date.now();
            const refreshToken = localStore.refresh;
            let accessToken = localStore.access;

            // check if token is expired
            if (refreshToken && now >= expires) {
              console.log("found expired acces token and refresh token", {now: new Date(now).toLocaleString(), expires: new Date(expires).toLocaleString()}, now >= expires);
              // fetch new token
              try {
                const response = await ky.post(`${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`, { json: { refresh: refreshToken } }).json() as { access: string };
                console.log("got new access token", response);

                accessToken = response.access;
                store.setAccessToken(response.access);
              } catch (error) {
                console.error("Failed to refresh token:", error);
              }
            }

            // await store.fetchRefresh();

            // return acces from fetchRefresh and set/use manually
            // console.log("new store in ky hook", store, store.access, store.expires);
            if (localStore.access) {
              request.headers.set("Authorization", `Bearer ${accessToken}`);
            }
          }
        },
      ],
    },
  });

  return api;
}
