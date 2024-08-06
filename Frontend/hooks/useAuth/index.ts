import ky from 'ky';
import { useState, useEffect, useContext, createContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';


const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ky.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/`,
        {json: credentials}
      ).json();

      const decoded = jwtDecode(response.access);
      setUser(decoded);

      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      localStorage.setItem('access_expires', decoded.exp.toString());

      router.push("/");
    } catch (error) {
      console.error('Failed to login:', error);
      const errorResponse = await error.response.json();

      if (errorResponse.detail) {
        setError(errorResponse.detail);
      } else {
        setError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  };

  const refresh = async () => {
    const refreshToken = localStorage.getItem('refresh');

    if (refreshToken) {
      try {
        const response = await ky.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
          { json: {refresh: refreshToken} }
        ).json();

        setUser(response);
        localStorage.setItem('access', response.access);
      } catch (error) {
        console.error('Failed to refresh token:', error);
        logout(); // Handle potential refresh token expiration
      }
    }
  }

  const verify = async () => {
    const accessToken = localStorage.getItem('access');

    if (accessToken) {
      try {
        const response = await ky.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/token/verify/`,
          { json: {token: accessToken} }
        ).json();

        console.log('Token is valid:', response);
      } catch (error) {
        console.error('Failed to verify token:', error);
        logout(); // Handle potential token expiration
      }
    }
  }

  const register = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ky.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register/`,
        {json: credentials}
      ).json();

      router.push("/login");
    } catch (error) {
      const errorResponse = await error.response.json();

      if (errorResponse.detail) {
        setError(errorResponse.detail);
      } else {
        setError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing tokens and refresh if necessary (optional)
  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    const refreshToken = localStorage.getItem('refresh');
    const accessExpires = localStorage.getItem('access_expires');
    let decoded = accessToken != null ? jwtDecode(accessToken) : null;

    if (accessToken && refreshToken && accessExpires && Date.now() >= parseInt(accessExpires) * 1000) {
      const handleRefresh = async () => {
        try {
          const response = await ky.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
            { json: {refresh: refreshToken} }
          ).json();

          decoded = jwtDecode(response.access);
          localStorage.setItem('access', response.access);
        } catch (error) {
          console.error('Failed to refresh token:', error);
          logout(); // Handle potential refresh token expiration
        }
      };

      // Set a timeout to refresh the access token before it expires
      const timeoutId = setTimeout(handleRefresh, 50); // Convert milliseconds to seconds

      return () => clearTimeout(timeoutId); // Clear timeout on unmount
    }

    setUser(decoded);
  }, []);

  return { user, isLoading, error, login, logout, refresh, verify, register};
};

export default useAuth;

