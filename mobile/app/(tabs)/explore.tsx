import { Image } from 'expo-image';
import { Text, StyleSheet } from 'react-native';

export default function TabTwoScreen() {
  return (
    <Text>teste</Text>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
