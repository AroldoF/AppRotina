import React from "react";
import { View, Text, StyleSheet } from 'react-native';

type CampoProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
}

const TarefaCampo = (props:CampoProps)=> {
    return (
        <View >
            <Text >{}</Text>
            <Text >Valor do Campo</Text>
        </View>
    );
}