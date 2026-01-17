import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User, AuthContextType, OTPResponse } from '../types';

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

  const login = async (aadhar: string): Promise<OTPResponse> => {
    try {
      const response = await api.post<OTPResponse>('/auth/login', { aadhar });
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed';
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        throw new Error('Cannot connect to server. Make sure the backend is running on http://localhost:8000');
      }
      throw new Error(errorMessage);
    }
  };

  const verifyOTP = async (aadhar: string, otpId: string, otpCode: string) => {
    try {
      const response = await api.post('/auth/verify-otp', {
        aadhar,
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
