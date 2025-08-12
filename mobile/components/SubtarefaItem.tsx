// SubtarefaItem.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';

type Subtarefa = {
  id: number;
  title: string;
  description: string;
  conclusion_date: string | null;
};

type SubtarefaItemProps = {
  subtarefa: Subtarefa;
};

const SubtarefaItem = ({ subtarefa }: SubtarefaItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.subtarefaContainer}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.title}>
          {subtarefa.title} - {subtarefa.conclusion_date ? subtarefa.conclusion_date : 'Sem data de conclusão'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          <Text>{subtarefa.description}</Text>
          <View style={styles.buttonsRow}>
            <Button title="Editar" onPress={() => alert(`Editar subtarefa ${subtarefa.id}`)} />
            {/* <Button title="Visualizar" onPress={() => alert(`Visualizar subtarefa ${subtarefa.id}`)} /> */}
            <Button title="Excluir" onPress={() => alert(`Excluir subtarefa ${subtarefa.id}`)} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subtarefaContainer: {
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  details: {
    marginTop: 5,
    paddingLeft: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default SubtarefaItem;
