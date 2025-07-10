import React from "react";
import {TextInput, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const url_api = 'http://127.0.0.1:8000/api/login/'

export default function Login(){
    return (
        <View style={styles.formulario}>
            <Text>Login</Text>
                <View>
                    <Text>Username</Text>
                    <TextInput/>
                </View>
                <View>
                    <Text>Senha</Text>
                    <TextInput/>
                </View>
                <TouchableOpacity>
                    <Text>Logar</Text>
                </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  formulario : {
      width: '80%',
      height: '50%',
      margin: 'auto',
      padding: 30,
      borderRadius: 10,
      justifyContent: 'space-around',
      alignContent: 'space-around',
      backgroundColor: '#f23',
      color: '#ff5'
  }
});
