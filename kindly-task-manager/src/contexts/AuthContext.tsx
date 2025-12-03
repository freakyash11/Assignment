import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, AuthState } from '@/types';
import api from '@/lib/api';

interface AuthContextType extends AuthState {
  signin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start with loading true
  });

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Verify token is still valid by fetching user data
          const response = await api.get('/auth/me');
          setAuthState({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const signin = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatar || '',
          timezone: user.timezone || '',
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      
      const { token, user } = response.data;
      
      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatar || '',
          timezone: user.timezone || '',
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  }, []);

  const signout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    try {
      const response = await api.put('/user/profile', {
        name: updates.name,
        avatar: updates.avatarUrl,
        bio: updates.timezone, // You can add bio field to User type if needed
      });
      
      const updatedUser = response.data.user;
      
      const newUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatar || '',
        timezone: updatedUser.bio || '',
      };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setAuthState(prev => ({
        ...prev,
        user: newUser,
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Update failed');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, signin, signup, signout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}