import React from 'react';
import { ScrollView, ActivityIndicator, Text, StyleSheet, View } from 'react-native';
import TarefaItem from '@/components/TarefaItem';
import dayjs from 'dayjs';
import { useTasks } from '@/context/TaskContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

type Subtarefa = {
  id: number;
  title: string;
  description: string;
  conclusion_date: string | null;
  completed: 'P' | 'C' | 'F';
};

export type Tarefa = {
  id: number;
  title: string;
  description: string;
  completed?: 'P' | 'C' | 'F';
  created_at: string;
  conclusion_date: string | null;
  difficulty: 'F' | 'I' | 'D';
  subtasks: Subtarefa[];
  id_user: number;
};

type ListaDeTarefasProps = {
  label: string;
  date: dayjs.Dayjs;
  tipo: 'Pendentes' | 'Finalizadas';
};

const ListaDeTarefas = ({ date, label, tipo }: ListaDeTarefasProps) => {
  const { tasks } = useTasks();

  if (!tasks) {
    return <ActivityIndicator size="large" />;
  }

  let tarefasFiltradas: Tarefa[] = [];

  try {
    if (tipo === 'Pendentes') {
      tarefasFiltradas = tasks.filter(t => {
        if (t.completed !== 'P') return false;
        if (!t.conclusion_date) return true;

        const dataConclusao = dayjs(t.conclusion_date).startOf('day');
        return dataConclusao.isSame(date.startOf('day'));
      });
    } else {
      tarefasFiltradas = tasks.filter(t => {
        if (t.completed !== 'C' && t.completed !== 'F') return false;
        if (!t.conclusion_date) return true;

        const dataConclusao = dayjs(t.conclusion_date);
        return (
          dataConclusao.month() === date.month() &&
          dataConclusao.year() === date.year()
        );
      });
    }
  } catch (error) {
    console.error('Erro ao filtrar tarefas:', error);
  }

  if (tarefasFiltradas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{label}</Text>
        <Text>Nenhuma tarefa encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <GestureHandlerRootView>
        <SafeAreaView>
          <Text style={styles.title}>{label}</Text>

          {tipo === 'Pendentes' &&
            tarefasFiltradas.map(tarefa => (
              <TarefaItem key={tarefa.id} tarefa={tarefa} />
            ))}

          {tipo === 'Finalizadas' && (
            <>
              <Text style={[styles.sectionTitle, { color: 'green' }]}>Concluídas</Text>
              {tarefasFiltradas
                .filter(t => t.completed === 'C')
                .map(tarefa => (
                  <TarefaItem
                    key={tarefa.id}
                    tarefa={tarefa}
                    styleOverride={{ borderLeftColor: 'green', borderLeftWidth: 4 }}
                  />
                ))}

              <Text style={[styles.sectionTitle, { color: 'red', marginTop: 15 }]}>Falhas</Text>
              {tarefasFiltradas
                .filter(t => t.completed === 'F')
                .map(tarefa => (
                  <TarefaItem
                    key={tarefa.id}
                    tarefa={tarefa}
                    styleOverride={{ borderLeftColor: 'red', borderLeftWidth: 4 }}
                  />
                ))}
            </>
          )}
        </SafeAreaView>
      </GestureHandlerRootView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 20,
    minWidth: '80%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 20,
    color: '#1F6E70',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ListaDeTarefas;
