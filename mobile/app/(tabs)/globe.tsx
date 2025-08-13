import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';

const Ranking = () => {
  const [rankingData, setRankingData] = useState([]);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [username, setUserName] = useState('');
  const { user_id } = useAuth();
  const { tasks } = useTasks(); // Atualiza ao mudar tarefas

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/points/');
        const sorted = [...response.data].sort((a, b) => b.points - a.points);
        setRankingData(sorted);

        const position = sorted.findIndex((u) => u.user_id === user_id);
        const user = sorted[position];

        if (user) {
          setUserPosition(position + 1);
          setUserName(user.username);
        } else {
          setUserPosition(null);
          setUserName('');
        }
      } catch (error) {
        console.error('Erro ao buscar ranking:', error);
      }
    };

    fetchRanking();
  }, [tasks, user_id]); // ← Gatilhos corretos

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>

      {/* TOP 4 RANKING */}
      <View style={styles.topRanking}>
        {rankingData.slice(0, 4).map((user, index) => (
          <View
            key={user.user_id}
            style={[
              styles.userRow,
              user.user_id === user_id && { backgroundColor: '#E0F2F1', borderRadius: 6 },
            ]}
          >
            <View style={styles.userRow}>
              <Text style={styles.rank}>{index + 1}</Text>
              <Text style={styles.username}>{user.username}</Text>
            </View>
            <Text style={styles.points}>{user.points} pts</Text>
          </View>
        ))}
      </View>

      {/* SUA POSIÇÃO */}
      {userPosition !== null && (
        <View style={styles.userPosition}>
          <Text style={styles.positionText}>Sua Posição</Text>
          <Text style={styles.userText}>{userPosition}º lugar</Text>
          <Text style={styles.userText}>{username}</Text>
          <Text style={styles.pointsText}>
            {rankingData[userPosition - 1]?.points} pts
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1F6E70',
  },
  topRanking: {
    marginBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomColor: '#ddd',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  username: {
    marginLeft: 15,
    fontSize: 18,
    color: '#333',
  },
  points: {
    alignSelf: 'center',
    fontSize: 18,
    color: '#FF5722',
  },
  userPosition: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  positionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userText: {
    fontSize: 18,
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
  },
});

export default Ranking;
