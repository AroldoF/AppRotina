import React, { useState } from "react";
import axios from "axios";
import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Campo_Texto from "@/components/Campo_Texto";

const API_LOGIN_URL = 'http://127.0.0.1:8000/api/login/';

export default function Login() {
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
    setErrors(prev => ({ ...prev, geral: '' }));

    try {
      const response = await axios.post(API_LOGIN_URL, { username, password });
      const { access, refresh } = response.data;
      console.log("Tokens recebidos:", access, refresh);

      // Aqui você pode salvar os tokens (AsyncStorage, por exemplo) e redirecionar:
      // await AsyncStorage.setItem('accessToken', access);
      router.replace('/');

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const mensagemErro = error.response?.data?.detail || 'Erro ao logar';
        setErrors(prev => ({ ...prev, geral: mensagemErro }));
      } else {
        setErrors(prev => ({ ...prev, geral: 'Erro desconhecido ao tentar logar' }));
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
