import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import ky from 'ky';
import router from 'next/router';
import useAPI from '../hooks/useAPI';

type JWTTokens = {
	access: string;
	refresh: string;
};

const authStore = create(
	devtools(
	persist(
		(set, get) => ({
			user: null,
			isLoggedIn: false,
			loading: false,
			error: null,
			access: null,
			refresh: null,
			expires: null,

			login: async (credentials) => {
				set({ loading: true, error: null });

				try {
					const response = await ky.post(`${process.env.NEXT_PUBLIC_API_URL}/api/token/`, { json: credentials }).json() as JWTTokens;
					const decodedToken = jwtDecode(response.access);
					set({
						user: decodedToken,
						isLoggedIn: true,
						loading: false,
						access: response.access,
						refresh: response.refresh,
						expires: decodedToken.exp * 1000,
					});
					router.push('/');
				} catch (error) {
					set({ error: error.message, loading: false });
				}
			},

			logout: () => {
				set({
					user: null,
					isLoggedIn: false,
					access: null,
					refresh: null,
					expires: null,
				});
				router.push('/');
			},

			fetchRefresh: async () => {
				const now = Date.now();
				const expires = get().expires;
				console.log('check refresh in store', {currentDate: now, expires: expires, compare: now >= expires});

				const refreshToken = get().refresh as string;

				if (refreshToken && now >= expires) {
					console.log('found expired acces token and refresh token');
					try {
						const response = await ky.post(`${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`, { json: { refresh: refreshToken } }).json() as { access: string };
						console.log('got new access token', response);

						const decodedToken = jwtDecode(response.access);
						set({
							user: decodedToken,
							isLoggedIn: true,
							loading: false,
							access: response.access,
							expires: decodedToken.exp,
						});
					} catch (error) {
						console.error('Failed to refresh token:', error);
					}
				}
			},
			setAccessToken: (access: string) => {
				const decodedToken = jwtDecode(access);
				set({
					user: decodedToken,
					isLoggedIn: true,
					loading: false,
					access: access,
					expires: decodedToken.exp,
				});
			},
		}),
		{
			name: 'auth',
			// skipHydration: true,
		}
	)
	)
);

export default authStore;
