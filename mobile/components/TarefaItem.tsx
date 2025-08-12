import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator, Alert, Modal, TextInput, Button } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

import CampoTexto from '@/components/Campo_Texto';
import SubtarefaItem from '@/components/SubtarefaItem';
import { router } from 'expo-router';
// import { Background } from '@react-navigation/elements';
import { ScrollView, Swipeable } from 'react-native-gesture-handler';

type Subtarefa = {
  id: number;
  title: string;
  description: string;
  conclusion_date: string | null;
};

export type Tarefa = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  conclusion_date: string | null;
  user: number;
  subtasks: Subtarefa[];
};

type TarefaItemProps = {
  tarefa: Tarefa;
};

dayjs.locale('pt-br');

const TarefaItem: React.FC<TarefaItemProps> = ({ tarefa }) => {
  const [expanded, setExpanded] = useState(false);
  const [subtasks, setSubtasks] = useState<Subtarefa[]>([]);
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(tarefa.title);
  const [editedDescription, setEditedDescription] = useState(tarefa.description);
  const [editedDueDate, setEditedDueDate] = useState(tarefa.conclusion_date ? new Date(tarefa.conclusion_date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(true);


const renderRightActions = () => (
  <View style={{ flexDirection: 'row' }}>
    <Pressable style={[styles.button, styles.deleteButton, {marginBottom: 20,}]} onPress={()=>''}>
      <Feather name="x-circle" size={18} color="#fff" />
    </Pressable>
  </View>
);

const renderLeftActions = () => (
  <View style={{ flexDirection: 'row',}}>
    <Pressable style={[styles.button, styles.viewButton, {marginBottom: 20,}]} onPress={() => ''}>
      <Feather name="check-circle" size={18} color="#fff" />
    </Pressable>
  </View>
);

  // Função para buscar as subtarefas da tarefa
  const fetchSubtasks = async () => {
    setLoadingSubtasks(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/tasks/${tarefa.id}/subtasks/`);
      setSubtasks(response.data); // Atualiza o estado com as subtarefas
    } catch (error) {
      console.error('Erro ao buscar subtarefas:', error);
    } finally {
      setLoadingSubtasks(false);
    }
  };

  // Quando a tarefa for expandida, buscar as subtarefas
  useEffect(() => {
    if (expanded) {
      fetchSubtasks(); // Faz a requisição quando expandir
    } else {
      setSubtasks([]); // Limpa as subtarefas quando fechar
    }
  }, [expanded, tarefa.id]);

  // const handleView = () => {
  //   router.push(`/tarefa/${tarefa.id}`); // Supondo que você tenha uma tela para detalhes da tarefa
  // };

  // Função para deletar a tarefa (chama a API para excluir)
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://192.168.0.169:8000/api/tasks/${tarefa.id}/`);
      if (response.status === 200) {
        Alert.alert("Sucesso", `Tarefa ${tarefa.id} excluída com sucesso.`);
      }
    } catch (error) {
      Alert.alert("Erro", "Houve um erro ao excluir a tarefa.");
    }
  };

  const handleEdit = () => {
    // Exibe o modal para editar a tarefa
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/tasks/${tarefa.id}/`, {
        title: editedTitle,
        description: editedDescription,
        conclusion_date: editedDueDate ? dayjs(editedDueDate).format('YYYY-MM-DD') : null,
      });

      if (response.status === 200) {
        Alert.alert("Sucesso", `Tarefa ${tarefa.id} editada com sucesso.`);
        setModalVisible(false); // Fecha o modal após salvar
      }
    } catch (error) {
      Alert.alert("Erro", "Houve um erro ao editar a tarefa.");
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || editedDueDate;
    // setShowDatePicker(false); // Fechar o DateTimePicker após a seleção
    setEditedDueDate(currentDate); // Atualizar a data
  };
  const handleSwipeRight = () => {
    // Fazendo PATCH ao deslizar para a direita para marcar como "completa" por exemplo
    handlePatchStatus('F'); // 'C' para concluída, por exemplo
  };

  const handleSwipeLeft = () => {
    // Fazendo PATCH ao deslizar para a esquerda para marcar como "pendente"
    handlePatchStatus('C'); // 'P' para pendente
  };
  const handlePatchStatus = async (newStatus: string) => {
    try {
      const response = await axios.patch(`http://192.168.0.169:8000/api/tasks/${tarefa.id}/`, {
        completed: newStatus,
      });
      
      if (response.status === 200) {
        
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar o status da tarefa.');
    }
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      rightThreshold={42}
      leftThreshold={42}
      overshootRight={false}
      overshootLeft={false}
      onSwipeableRightOpen={handleSwipeRight} // Trigger on swipe right
      onSwipeableLeftOpen={handleSwipeLeft}   // Trigger on swipe left
    >
      <View style={styles.tarefaContainer}>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header} activeOpacity={0.7}>
          <Text style={styles.title}>{tarefa.title}</Text>
          <Text style={[styles.date, !tarefa.conclusion_date && styles.noDate]}>
            {tarefa.conclusion_date
              ? dayjs(tarefa.conclusion_date).format('DD [de] MMM YYYY')
              : ''}
          </Text>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.details}>
            <View>
              <View style={styles.buttonsRow}>
                <Pressable style={[styles.button, styles.editButton]} onPress={() => setModalVisible(true)}>
                  <Feather name="edit" size={18} color="#fff" />
                </Pressable>
                <Pressable style={[styles.button, styles.deleteButton]} onPress={() => { /* Deletar Tarefa */ }}>
                  <Feather name="trash" size={18} color="#fff" />
                </Pressable>
              </View>
            </View>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.description}>{tarefa.description || 'Sem descrição'}</Text>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.description}>
              {tarefa.completed === 'P'
                ? 'Pendente'
                : tarefa.completed === 'C'
                ? 'Concluída'
                : 'Status desconhecido'}
            </Text>
            <Text style={styles.label}>Criada em:</Text>
            <Text style={styles.description}>{dayjs(tarefa.created_at).format('DD [de] MMM YYYY HH:mm')}</Text>
            {loadingSubtasks ? (
              <ActivityIndicator size="large" color="#2a9d9f" />
            ) : (
              <>
                <Text style={styles.label}>Subtarefas:</Text>
                {subtasks.length > 0 ? (
                  <View style={styles.subtasksContainer}>
                    {subtasks.map((subtarefa) => (
                      <SubtarefaItem key={subtarefa.id} subtarefa={subtarefa} />
                    ))}
                  </View>
                ) : (
                  <Text style={styles.description}>Sem subtarefas.</Text>
                )}
              </>
            )}
          </View>
        )}
      </View>
      
      {/* Modal para editar a tarefa */}
      <Modal
  visible={modalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Editar Tarefa</Text>

      <CampoTexto
        label="Título"
        value={editedTitle}
        onChangeText={setEditedTitle}
        placeholder="Digite o título"
        required
      />

      <CampoTexto
        label="Descrição"
        value={editedDescription}
        onChangeText={setEditedDescription}
        placeholder="Digite a descrição"
        required
        multiline
        numberOfLines={3}
      />

      <View>
        <Text style={styles.label}>Data de Conclusão:</Text>
        <DateTimePicker
          style={styles.datePicker}
          value={editedDueDate}
          mode="date"
          display="spinner"
          textColor="#000"
          onChange={handleDateChange}
        />
      </View>

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSaveEdit}
          disabled={!editedTitle || !editedDescription}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  </Modal>
      </Swipeable>
  );
};

const styles = StyleSheet.create({
  tarefaContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    // flexWrap: 'wrap',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2a9d9f',
    flexShrink: 1,
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  noDate: {
    color: '#c0392b',
    fontWeight: '600',
  },
  details: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
  },
  description: {
    fontSize: 15,
    color: '#333',
    width: '50%',
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
    gap: 10,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 6,
  },
  editButton: {
    backgroundColor: '#2980b9',
  },
  viewButton: {
    backgroundColor: '#27ae60',
    padding: 8,
  },
  deleteButton: {
    backgroundColor: '#c0392b',
  },
  subtasksContainer: {
    marginLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#2a9d9f',
    paddingLeft: 12,
    paddingBottom: 8,
  },
  descriptionContainer: {
  marginBottom: 10,
  flexDirection: 'row', // Agora os itens ficam lado a lado
  justifyContent: 'space-between', // Descrição à esquerda e botões à direita
  alignItems: 'center', // Alinha verticalmente os itens no centro
},
 modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxWidth: 400,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2a9d9f',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#bbb',
    marginRight: 10,
  },

  saveButton: {
    backgroundColor: '#2a9d9f',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // DateTimePicker styling
  datePicker: {
    marginVertical: 10,
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
});

export default TarefaItem;