import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function MenuScreen() {
  const handleConnectGoogleCalendar = () => {
    Alert.alert('Google Calendar', 'Funcionalidade ainda não implementada.');
    // Aqui você pode colocar a lógica para autenticar com Google Calendar futuramente.
  };
  const {logout} = useAuth(); // Supondo que você tenha um hook useAuth para gerenciar autenticação

  const handleAjuda = () => {
    Alert.alert('Ajuda', 'Aqui vão informações de ajuda para o usuário.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/perfil')}>
        <Ionicons name="person-circle-outline" size={24} color="#1F6E70" />
        <Text style={styles.menuText}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/configuracoes')}>
        <Ionicons name="settings-outline" size={24} color="#1F6E70" />
        <Text style={styles.menuText}>Configurações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={handleConnectGoogleCalendar}>
        <Ionicons name="calendar-outline" size={24} color="#1F6E70" />
        <Text style={styles.menuText}>Conectar com calendar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={handleAjuda}>
        <Ionicons name="help-circle-outline" size={24} color="#1F6E70" />
        <Text style={styles.menuText}>Ajuda</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={logout}>
        <Ionicons name="log-out-outline" size={24} color="#1F6E70" />
        <Text style={styles.menuText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1F6E70',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#E0F7FA',
    padding: 15,
    borderRadius: 10,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 20,
    marginLeft: 15,
    color: '#000',
  },
});
