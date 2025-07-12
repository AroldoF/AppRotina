import { useEffect } from 'react';
import { Stack, router } from 'expo-router';

export default function AuthLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen
        name="register"
        options={{
          title: 'Cadastro',
          headerShown: true, // Mostra o cabeçalho com botão de voltar
        }}
      />
    </Stack>
  );
}
