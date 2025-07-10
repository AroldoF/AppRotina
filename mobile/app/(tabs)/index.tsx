import { Link } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>Ola</Text>
      <Link href="/(auth)/login">Ir para login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  
});
