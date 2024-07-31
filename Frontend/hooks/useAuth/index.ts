import ky from 'ky';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ky.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/`,
        {json: credentials}
      ).json();

      console.log("response", response);

      const decoded = jwtDecode(response.access);
      console.log("user", decoded);

      setUser(decoded);
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      localStorage.setItem('access_expires', decoded.exp.toString());
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const refresh = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      try {
        const response = await ky.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
          { json: {refresh: refreshToken} }
        ).json();

        setUser(response);
        localStorage.setItem('access_token', response.access);
      } catch (error) {
        console.error('Failed to refresh token:', error);
        logout(); // Handle potential refresh token expiration
      }
    }
  }

  const verify = async () => {
    const accessToken = localStorage.getItem('access_token');

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

  // Check for existing tokens and refresh if necessary (optional)
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const accessExpires = localStorage.getItem('access_expires');
    let decoded = jwtDecode(accessToken);

    if (accessToken && refreshToken && accessExpires && Date.now() >= parseInt(accessExpires) * 1000) {
      const handleRefresh = async () => {
        try {
          const response = await ky.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
            { json: {refresh: refreshToken} }
          ).json();

          decoded = jwtDecode(response.access);
          localStorage.setItem('access_token', response.access);
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

  return { user, isLoading, error, login, logout, refresh, verify};
};

export default useAuth;

