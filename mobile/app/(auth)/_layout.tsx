import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { Tabs, router } from 'expo-router';

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/');
    }
  }, [loading, isAuthenticated]);

  if (loading) return null;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="login" options={{ title: 'Login' }} />
      <Tabs.Screen name="register" options={{ title: 'Register' }} />
    </Tabs>
  );
}
