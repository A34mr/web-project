import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── FIX #10: Refresh token support ──
  const getRefreshToken = () => localStorage.getItem('refreshToken');
  const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  };
  const clearTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  // Refresh access token using refresh token
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await api.post('/api/auth/refresh-token', { refreshToken });
      const { token } = response.data;
      setTokens(token, refreshToken);
      return token;
    } catch (err) {
      // Refresh token is invalid/expired, force logout
      clearTokens();
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify the token is still valid by fetching user profile
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          const response = await api.get('/api/auth/me');
          if (response.data && response.data.user) {
            setUser(response.data.user);
          } else {
            // Token invalid, try refresh
            const newToken = await refreshAccessToken();
            if (newToken) {
              api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
              const retryResponse = await api.get('/api/auth/me');
              if (retryResponse.data && retryResponse.data.user) {
                setUser(retryResponse.data.user);
              } else {
                clearTokens();
              }
            } else {
              clearTokens();
            }
          }
        } catch (err) {
          // If 401, try refreshing
          if (err.response?.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
              try {
                api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                const response = await api.get('/api/auth/me');
                if (response.data && response.data.user) {
                  setUser(response.data.user);
                } else {
                  clearTokens();
                }
              } catch {
                clearTokens();
              }
            } else {
              clearTokens();
            }
          } else {
            clearTokens();
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [refreshAccessToken]);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, refreshToken, user } = response.data;

    setTokens(token, refreshToken);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    const { token, refreshToken, user } = response.data;

    setTokens(token, refreshToken);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    return response.data;
  };

  const logout = async () => {
    try {
      const refreshToken = getRefreshToken();
      const accessToken = localStorage.getItem('token');
      // Only notify server if we appear to have an active session
      if (accessToken || refreshToken) {
        await api.post('/api/auth/logout', { refreshToken });
      }
    } catch (err) {
      // Silent catch: We're logging out anyway
    } finally {
      clearTokens();
      delete api.defaults.headers.common.Authorization;
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isPatient: user?.role === 'patient',
    isDoctor: user?.role === 'doctor',
    isClinicAdmin: user?.role === 'clinic_admin',
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
