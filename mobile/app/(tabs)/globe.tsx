// src/components/Ranking.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const Ranking = () => {
  const [rankingData, setRankingData] = useState([]);
  const [userData, setUserData] = useState(null);
  const {user_id} = useAuth();

  useEffect(() => {
    // Função para buscar os dados do ranking
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.0.169:8000/api/points/');
        setRankingData(response.data);
        
        // Encontrar a posição do usuário
        const user = response.data.find(user => user.user_id === user_id);
        setUserData(user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Ordena os usuários pelo número de pontos
  const sortedRanking = [...rankingData].sort((a, b) => b.points - a.points);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>

      {/* Top Ranking */}
      <View style={styles.topRanking}>
        {sortedRanking.slice(0, 4).map((user, index) => (
          <View key={user.user_id} style={styles.userRow}>
            <View style={styles.userRow}>
              <Text style={styles.rank}>{index + 1}</Text>
              <Text style={styles.username}>{user.username}</Text>
            </View>
            <Text style={styles.points}>{user.points} pts</Text>
          </View>
        ))}
      </View>

      {/* Sua Posição */}
      {userData && (
        <View style={styles.userPosition}>
          <Text style={styles.positionText}>Sua Posição</Text>
          <Text style={styles.userText}>Você ({userData.username})</Text>
          <Text style={styles.pointsText}>{userData.points} pts</Text>
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
    // borderBottomWidth: 1,
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
