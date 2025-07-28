import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext'; // ajuste o caminho se necessário

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  );
}
