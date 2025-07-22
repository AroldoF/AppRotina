// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { router } from 'expo-router';

axios.defaults.withCredentials = true;

// Tipagens
type AuthContextType = {
  loading: boolean;
  id_user: number | null;
  token: string | null;
  login: (props: UserLogin) => Promise<void>;
  register: (props: UserRegister) => Promise<void>;
};

type UserLogin = {
  username: string;
  password: string;
};

type UserRegister = {
  username: string;
  email: string;
  password: string;
  confirme_password: string;
};

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [id_user, setIdUser] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Lógica de login
  const login = async ({ username, password }: UserLogin) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });

      const { id, token } = response.data;

      setIdUser(id);
      setToken(token);

      // Aqui você pode salvar o token no AsyncStorage se quiser manter o login
      router.replace('/');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error?.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Lógica de registro
  const register = async ({ username, email, password, confirme_password }: UserRegister) => {
    try {
      await axios.post('http://localhost:8000/api/register', {
        username,
        email,
        password,
        confirme_password,
      });
      router.replace('/');
    } catch (error: any) {
      console.error('Erro ao registrar:', error?.response?.data || error.message);
      throw error;
    }
  };

  useEffect(() => {
    // Aqui você pode verificar se já tem token salvo (ex: AsyncStorage)
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        id_user,
        token,
        login,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};