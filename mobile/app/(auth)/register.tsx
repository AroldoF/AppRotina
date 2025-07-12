import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Campo_Texto from "@/components/Campo_Texto";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    geral: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validarCampos = () => {
    let valid = true;
    let newErrors = { username: "", email: "", password: "", confirmPassword: "", geral: "" };

    if (!username.trim()) {
      newErrors.username = "Por favor, insira seu usuário";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Por favor, insira seu email";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email inválido";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Por favor, insira sua senha";
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Por favor, confirme sua senha";
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = () => {
    if (!validarCampos()) {
      return;
    }

    // Aqui você pode fazer a requisição para sua API
    // setIsLoading(true);
    // axios.post(...) ...
    // depois setIsLoading(false)
  };

  return (
    <View style={styles.formulario}>
      <Text style={styles.tituloP}>Cadastre-se</Text>
      <Text style={{ marginBottom: 20 }}>Crie sua conta para continuar</Text>

      {errors.geral ? <Text style={styles.textError}>{errors.geral}</Text> : null}

      <Campo_Texto
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Digite seu usuário"
        errorMessage={errors.username}
      />

      <Campo_Texto
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
        errorMessage={errors.email}
      />

      <Campo_Texto
        label="Senha"
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        secureTextEntry
        errorMessage={errors.password}
      />

      <Campo_Texto
        label="Confirme a Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirme sua senha"
        secureTextEntry
        errorMessage={errors.confirmPassword}
      />

      <TouchableOpacity
        style={[styles.botao, isLoading && { backgroundColor: "#888" }]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={{ color: "#fff" }}>{isLoading ? "Carregando..." : "Cadastrar"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formulario: {
    margin: 'auto',
    padding: 30,
    borderRadius: 10,
    justifyContent: "center",
    gap: 10,
  },
  tituloP: {
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  botao: {
    backgroundColor: "#2C9C9F",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  textError: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
