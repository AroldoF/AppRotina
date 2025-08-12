import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Text, StyleSheet, View } from 'react-native';
import axios from 'axios';
import TarefaItem from '@/components/TarefaItem';
import dayjs from 'dayjs';
import { useAuth } from '@/context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

type Subtarefa = {
  id: number;
  title: string;
  description: string;
  conclusion_date: string | null;
  completed: 'P' | 'C' | 'F';  // corrigido aqui
};

export type Tarefa = {
  id: number;
  title: string;
  description: string;
  completed?: 'P' | 'C' | 'F';  // corrigido aqui
  created_at: string;
  conclusion_date: string | null;
  difficulty: 'F' | 'I' | 'D';  // corrigido aqui
  subtasks: Subtarefa[];
  id_user: number;
};

type ListaDeTarefasProps = {
  label: string;
  date: dayjs.Dayjs;
  tipo: 'Pendentes' | 'Finalizadas';
};

const ListaDeTarefas = ({ date, label, tipo }: ListaDeTarefasProps) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(false);
  const { user_id } = useAuth();

  useEffect(() => {
  const fetchTarefas = async () => {
    if (!user_id) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.0.169:8000/api/users/${user_id}/tasks/`
      );
      // console.log('Dados recebidos:', response.data);

      let filtradas: Tarefa[] = [];

      if (tipo === 'Pendentes') {
        filtradas = response.data.filter((t: Tarefa) => {
          try {
            // console.log('Analisando tarefa:', t.title, t.completed, t.conclusion_date);
            if (t.completed !== 'P') return false;
            
            
            if (!t.conclusion_date) return true;
            const dataConclusao = dayjs(t.conclusion_date).startOf('day');
            return dataConclusao.isSame(date.startOf('day'));
          } catch (err) {
            console.error('Erro no filtro pendente:', err, t);
            return false;
          }
        });
      } else {
        filtradas = response.data.filter((t: Tarefa) => {
          try {
            // Corrigido: deve ser OR no lugar de AND para status
            if (t.completed !== 'C' && t.completed !== 'F') return false;
            if (!t.conclusion_date) return true;

            const dataConclusao = dayjs(t.conclusion_date);
            return (
              dataConclusao.month() === date.month() &&
              dataConclusao.year() === date.year()
            );
          } catch (err) {
            console.error('Erro no filtro finalizado:', err, t);
            return false;
          }
        });
      }

      // console.log('Tarefas filtradas:', filtradas);
      setTarefas(filtradas);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchTarefas();
}, [date, tipo, user_id]);



  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (tarefas.length === 0) {
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

          {tipo === 'Pendentes' && (
            tarefas.map(tarefa => (
              <TarefaItem key={tarefa.id} tarefa={tarefa} />
            ))
          )}

          {tipo === 'Finalizadas' && (
            <>
              <Text style={[styles.sectionTitle, { color: 'green' }]}>Concluídas</Text>
              {tarefas
                .filter(t => t.completed === 'C')
                .map(tarefa => (
                  <TarefaItem
                    key={tarefa.id}
                    tarefa={tarefa}
                    styleOverride={{ borderLeftColor: 'green', borderLeftWidth: 4 }}
                  />
                ))}

              <Text style={[styles.sectionTitle, { color: 'red', marginTop: 15 }]}>Falhas</Text>
              {tarefas
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
    marginTop: -20,
    marginBottom: 20,
    color: '#1F6E70',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});

export default ListaDeTarefas;
