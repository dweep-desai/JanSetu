import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { API_BASE_URL } from '../services/api';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (phone: string) => {
    try {
      console.log('Attempting to login with phone:', phone);
      // DEBUG: Alert to check config
      window.alert(`Attempting login to: ${API_BASE_URL}\nCheck if this URL is correct.`);
      
      const response = await api.post('/auth/login', { phone });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      // More specific error handling
      if (error.code === 'ECONNREFUSED' || 
          error.code === 'ERR_NETWORK' ||
          error.message?.includes('Network Error') ||
          error.message?.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to server. Make sure the backend is running on ${API_BASE_URL}`);
      }
      
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed';
      // DEBUG: Alert on error
      window.alert(`Login Error:\n${errorMessage}\n\nBackend URL: ${API_BASE_URL}`);
      throw new Error(errorMessage);
    }
  };

  const verifyOTP = async (phone: string, otpId: string, otpCode: string) => {
    try {
      const response = await api.post('/auth/verify-otp', {
        phone,
        otp_id: otpId,
        otp_code: otpCode,
      });
      
      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('token', access_token);
      
      // Fetch user details
      const userResponse = await api.get('/auth/me');
      const userData = userResponse.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'OTP verification failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    verifyOTP,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
