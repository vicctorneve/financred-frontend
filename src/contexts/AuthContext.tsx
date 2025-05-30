
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, ApiResponse } from '../types';
import { api } from '../services/api';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  registerInfosExtras: (userData: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);


  const checkAuthStatus = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (token) {
        setIsLoading(false);  
        return;
      }
      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // const response = await api.get<ApiResponse<User>>('/auth/login');
      // if (response.status == 200) {
      //   setUser(response.data || null);
      // } else {
      //   localStorage.removeItem('token');
      //   setUser(null); 
      // }
    } catch (error) {
      console.error('Authentication error:', error);
      localStorage.removeItem('token');
      setUser(null);
      toast({
        title: "Authentication Error",
        description: "Your session has expired. Please login again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registerInfosExtras = (userData) =>{
    setUser(userData as User);
  }

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.status == 200 && response.data) {
        const userData  = response.data;
        localStorage.setItem('token', userData.token || '');
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        setUser(userData as User);
        setUser(prev => ({ ...prev, cpf: credentials.cpf }));
        setUser(prev => ({ ...prev, name: credentials.name }));
        
        toast({
          title: "Logado com sucesso",
          description: `Seja bem-vindo, ${userData.name}!`,
        });
      } else {
        toast({
          title: "Login failed",
          description: response.data.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = '';
    setUser(null);
    toast({
      title: "Logout successful",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuthStatus,
        registerInfosExtras
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
