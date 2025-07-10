// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';

axios.defaults.withCredentials = true;

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  username: string | null;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  username: null,
});

export const AuthProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const reponse = await axios.get('http://localhost:8000/api/session/');
        if (reponse.data?.isAuthenticated) {
          setIsAuthenticated(true);
          setUsername(reponse.data.username);
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

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, username}}
    >
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
