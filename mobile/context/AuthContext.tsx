// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';

axios.defaults.withCredentials = true;

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  username: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  username: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/session/');
        if (res.data?.isAuthenticated) {
          setIsAuthenticated(true);
          setUsername(res.data.username);
        } else {
          setIsAuthenticated(false);
          setUsername(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      await axios.post('http://localhost:3000/api/login/', credentials);
      setIsAuthenticated(true);
      // Após login, você pode querer fazer nova requisição para pegar o username
      const res = await axios.get('http://localhost:3000/api/session/');
      setUsername(res.data.username);
      router.replace('/');
    } catch (error) {
      console.error('Erro ao logar:', error);
      setIsAuthenticated(false);
      setUsername(null);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, username, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
