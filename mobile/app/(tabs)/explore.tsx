import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useAuth } from "@/context/AuthContext";
import TarefaItem, { Tarefa } from "@/components/TarefaItem"; // import do componente já pronto

const Checklist = () => {
  const [tasks, setTasks] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const { user_id } = useAuth();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed === "C").length;
  const failureTasks = tasks.filter((t) => t.completed === "F").length;
  const pendingTasks = tasks.filter((t) => t.completed === "P").length;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  const CircularProgress = ({ progress }: { progress: number }) => {
    const size = 100;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - circumference * progress;

    return (
      <Svg width={size} height={size}>
        <Circle
          stroke="#E0E0E0"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#009688"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
    );
  };

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.169:8000/api/users/${user_id}/tasks/`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar as tarefas:", error);
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) return <Text>Carregando...</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{fontSize: 24,fontWeight: 'bold',marginBottom: 20,textAlign: 'center', color: '#1F6E70'}}>Histórico de Tarefas</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text>Total</Text>
          <Text style={styles.summaryNumber}>{totalTasks}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text>Falhadas</Text>
          <Text style={styles.summaryNumber}>{failureTasks}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text>Concluídas</Text>
          <Text style={styles.summaryNumber}>{completedTasks}</Text>
        </View>
        
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tarefas em progresso</Text>
        <CircularProgress progress={progress} />
        <Text style={styles.progressText}>
          {completedTasks}/{totalTasks} concluídas (
          {Math.round(progress * 100)}%)
        </Text>
      </View>

      {tasks.map((task) => (
        <TarefaItem key={task.id} tarefa={task} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, marginBottom: 10, color: '#1F6E70' },
  progressText: { marginTop: 10, fontSize: 14 },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  summaryNumber: { fontSize: 18, fontWeight: "bold" },
});

export default Checklist;
