// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

axios.defaults.withCredentials = true;

type AuthContextType = {
  loading: boolean;
  initialized: boolean;
  user_id: number | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (props: UserLogin) => Promise<void>;
  register: (props: UserRegister) => Promise<void>;
  logout: () => Promise<void>;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'http://localhost:8000'; // troque para IP local se for testar em dispositivo físico

// function setAxiosAuthToken(token: string | null) {
//   if (token) {
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     axios.defaults.headers.common['Authorization'] = ``;
//     // delete axios.defaults.headers.common['Authorization'];
//   }
// }


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [user_id, setIdUser] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const isAuthenticated = !!token;

  // useEffect(() => {
  //   setAxiosAuthToken(token);
  // }, [token]);

  // Carrega do AsyncStorage
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        setLoading(true);

        const [storedToken, storedId, storedRefresh] = await Promise.all([
          AsyncStorage.getItem('@token'),
          AsyncStorage.getItem('@user_id'),
          AsyncStorage.getItem('@refresh_token'),
        ]);
        if (storedToken) {
          setToken(storbedToken);
          // setAxiosAuthToken(storedToken);
        }
        if (storedId) {
          setIdUser(Number(storedId));
        }
        if (storedRefresh) {
          setRefreshToken(storedRefresh);
        }
      } catch (e) {
        console.error('Erro ao carregar dados do storage', e);
      } finally {
        setInitialized(true);
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  // login
  const login = async ({ username, password }: UserLogin) => {
    setLoading(true);
    try {
      const response = await axios.post(
      `${API_BASE}/api/login/`,
      { username, password },
      { headers: { Authorization: '' } }
    );



      // Ajustado para os nomes reais do retorno
      const { user_id, access_token, refresh_token } = response.data;

      // Atualiza estado
      setIdUser(user_id);
      setToken(access_token);
      setRefreshToken(refresh_token);
      // setAxiosAuthToken(access_token);
      // Persiste no storage
      await AsyncStorage.setItem('@token', access_token);
      await AsyncStorage.setItem('@user_id', String(user_id));
      await AsyncStorage.setItem('@refresh_token', refresh_token);

      router.replace('/');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error?.response?.data || error?.message || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // register
  const register = async ({ username, email, password, confirme_password }: UserRegister) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/register/`, {
        username,
        email,
        password,
        confirme_password,
      });

      router.replace('/');
    } catch (error: any) {
      console.error('Erro ao registrar:', error?.response?.data || error?.message || error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // logout
  const logout = async () => {
    setLoading(true);
    try {
      setIdUser(null);
      setToken(null);
      setRefreshToken(null);
      // setAxiosAuthToken(null);

      await AsyncStorage.multiRemove(['@token', '@user_id', '@refresh_token']);

      router.replace('/(auth)/login');
    } catch (e) {
      console.error('Erro no logout:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        initialized,
        user_id,
        token,
        refreshToken,
        isAuthenticated,
        login,
        register,
        logout,
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
