// useRequireAuth.tsx
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export function useRequireAuth() {
  const { initialized, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // se ainda não inicializou, não faz nada
    if (!initialized) return;

    // se está carregando (login, logout, registro), também não faz nada
    if (!loading) return;

    // se já inicializou, não está carregando e não está autenticado → manda pro login
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [initialized, loading, isAuthenticated]);


  // a tela protegida vai saber se pode renderizar ou não
  return { loading, initialized, isAuthenticated };
}
