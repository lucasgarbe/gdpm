import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import ky from 'ky';
import router from 'next/router';

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

			login: async (credentials) => {
				set({ loading: true, error: null });

				try {
					const response = await ky.post(`${process.env.NEXT_PUBLIC_API_URL}/api/token/`, { json: credentials }).json() as JWTTokens;
					const token = response.access;
					const decodedToken = jwtDecode(token);
					set({ user: decodedToken, isLoggedIn: true, loading: false });
					// localStorage.setItem('token', token);
					router.push('/');
				} catch (error) {
					set({ error: error.message, loading: false });
				}
			},

			logout: () => {
				// localStorage.removeItem('token');
				set({ user: null, isLoggedIn: false });
			},

			refresh: async () => {
				// Implement token refresh logic here
				// ...
			},

			// ... other auth related functions
		}),
		{
			name: 'auth',
			skipHydration: true,
		}
	)
	)
);

export default authStore;
