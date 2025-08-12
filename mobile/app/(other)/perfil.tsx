import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Bem-vindo ao seu perfil!</Text>
      <TouchableOpacity style={styles.button} onPress={() => alert('Editar Perfil')}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F6E70',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2C9C9F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});