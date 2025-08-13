import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../context/AuthContext';
import { Slot } from 'expo-router';
import { StyleSheet } from 'react-native';
import { TaskProvider } from '@/context/TaskContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>

      <AuthProvider>
      <TaskProvider>
        <Slot />
      </TaskProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
