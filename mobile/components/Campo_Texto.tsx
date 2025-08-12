import React from "react";
import { useState } from "react";
import { TextInput, View, StyleSheet, Text } from "react-native";

type CampoTextoProps = {
  label: string;
  value: string;
  type?: string;
  multiline?: boolean;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  errorMessage?: string;
};

export default function Campo_Texto(props : CampoTextoProps) {
    // const error
    return (
        <View>
            <Text style={styles.label}>{props.label}</Text>
                <TextInput
                  style={styles.textInput}
                  // type={props.type}
                  multiline={props.multiline}
                  value={props.value}
                  onChangeText={props.onChangeText}
                  placeholder={props.placeholder}
                  autoCapitalize="none"
                  placeholderTextColor={'gray'}
                  secureTextEntry={props.secureTextEntry}
                />
            {props.errorMessage ? (
              <Text style={styles.errorText}>{props.errorMessage}</Text>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    textInput : {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderColor: '#edf1f3',
    borderWidth: 1,
  },
  label : {
    fontSize: 16,
    fontWeight: 500,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
})