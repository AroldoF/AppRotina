import React, { useState } from "react";
import axios from "axios";
import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Campo_Texto from "@/components/Campo_Texto";
import { useAuth } from '../../context/AuthContext';

const API_LOGIN_URL = 'http://127.0.0.1:8000/api/token/';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '', geral: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validarCampos = () => {
    let camposValidos = true;
    const novosErros = { username: '', password: '', geral: '' };

    if (!username.trim()) {
      novosErros.username = 'Por favor, insira seu usuário';
      camposValidos = false;
    }

    if (!password.trim()) {
      novosErros.password = 'Por favor, insira sua senha';
      camposValidos = false;
    }

    setErrors(novosErros);
    return camposValidos;
  };

  const handleLogin = async () => {
    if (!validarCampos()) return;

    setIsLoading(true);
    try {
      await login({ username, password });
    } catch (err: any) {
      if (err.response?.status === 401) {
        setErrors({ username: '', password: '', geral: 'Usuário ou senha incorretos' });
      } else {
        setErrors({ username: '', password: '', geral: 'Erro inesperado. Tente novamente mais tarde.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Entre com seu usuário e senha para logar</Text>

      {errors.geral !== '' && <Text style={styles.textError}>{errors.geral}</Text>}

      <Campo_Texto
        label="Usuário"
        value={username}
        onChangeText={setUsername}
        placeholder="Digite seu usuário"
        errorMessage={errors.username}
      />

      <Campo_Texto
        label="Senha"
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        secureTextEntry
        errorMessage={errors.password}
      />

      <TouchableOpacity style={styles.forgotPasswordButton}>
        <Text style={styles.textLink}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Carregando...' : 'Logar'}
        </Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text>Você não tem uma conta?</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.textLink}> Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    margin: 'auto',
    padding: 30,
    borderRadius: 10,
    gap: 10,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 10,
  },
  textLink: {
    color: '#4d81e7',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#2C9C9F',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
  },
  registerContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  textError: {
    color: 'red',
    marginBottom: 10,
  },
});
