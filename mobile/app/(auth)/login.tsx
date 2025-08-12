import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext'; // Importando o contexto de autenticação
import Campo_Texto from '@/components/Campo_Texto';

const Login = () => {
  const { login } = useAuth(); // Pegando a função login do contexto
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
      // Chama a função login do contexto
      await login({ username, password });

      // Após login bem-sucedido, navega para a página principal
      router.replace('/');
    } catch (error) {
      // Se houver erro, define a mensagem de erro no estado
      setErrors(prev => ({ ...prev, geral: 'Erro ao logar. Verifique suas credenciais.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 30,
    borderRadius: 10,
    gap: 10,
    justifyContent: 'center',
    flexGrow: 1,
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

export default Login;
