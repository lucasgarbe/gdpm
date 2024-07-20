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
      console.log("user", jwtDecode(response.access));

      setUser(jwtDecode(response.access));
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
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

  // Check for existing tokens and refresh if necessary (optional)
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && refreshToken) {
      const handleRefresh = async () => {
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
      };

      // Set a timeout to refresh the access token before it expires
      const timeoutId = setTimeout(handleRefresh, 300 * 1000); // Convert milliseconds to seconds

      return () => clearTimeout(timeoutId); // Clear timeout on unmount
    }
  }, []);

  return { user, isLoading, error, login, logout };
};

export default useAuth;

