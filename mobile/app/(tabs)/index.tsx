import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, Platform, Switch, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import ListaDeTarefas from '@/components/ListaDeTarefas';
import DateTimePicker from '@react-native-community/datetimepicker';
import Campo_Texto from '@/components/Campo_Texto';
import ModalSelector from 'react-native-modal-selector';
import { useTasks } from '@/context/TaskContext'; // Importa o contexto
import { GestureHandlerRootView } from 'react-native-gesture-handler';

dayjs.locale('pt-br');

export default function DateNavigatorWithCalendar() {
  const [date, setDate] = useState(dayjs());
  const [showCalendar, setShowCalendar] = useState(false);
  const { user_id } = useAuth();
  const { refreshTasks } = useTasks(); // Obtém o refreshTasks
  
  const [tipoSelecionado, setTipoSelecionado] = useState<'Pendentes' | 'Finalizadas'>('Pendentes');
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [editedDueDate, setEditedDueDate] = useState(new Date(dayjs().format('YYYY-MM-DD')));
  const [isDateChecked, setIsDateChecked] = useState(false);

  const previousDay = () => setDate(prev => prev.subtract(1, 'day'));
  const nextDay = () => setDate(prev => prev.add(1, 'day'));

  const getTitleByDate = (dateToCompare: any) => {
    const today = dayjs().startOf('day');
    const targetDate = dayjs(dateToCompare).startOf('day');
    const diff = targetDate.diff(today, 'day');
    if (diff === 0) return 'HOJE';
    if (diff > 0) return `Em ${diff} dia${diff > 1 ? 's' : ''}`;
    return `Há ${Math.abs(diff)} dia${Math.abs(diff) > 1 ? 's' : ''}`;
  };

  const handleSalvarTarefa = async () => {
    if (!titulo.trim()) {
      alert("Digite um título para a tarefa");
      return;
    }
    try {
      await axios.post(`http://localhost:8000/api/tasks/`, {
        title: titulo,
        description: descricao,
        difficulty: difficulty,
        conclusion_date: isDateChecked ? date.format('YYYY-MM-DD') : null,
        user: user_id || null,
      });
      setModalVisible(false);
      setTitulo('');
      setDescricao('');
      setDifficulty('');
      setIsDateChecked(false);
      await refreshTasks(); // Atualiza a lista global de tarefas
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | null) => {
    const currentDate = selectedDate || editedDueDate;
    setEditedDueDate(currentDate);
  };

  const difficultyOptions = [
    { key: 'B', label: 'Fácil' },
    { key: 'I', label: 'Intermediário' },
    { key: 'A', label: 'Difícil' },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.today}>{getTitleByDate(date)}</Text>
        <View style={styles.navigator}>
          <TouchableOpacity onPress={previousDay}>
            <Ionicons name="chevron-back" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{date.format('dddd')} - {date.format('D')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={nextDay}>
            <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>

        {showCalendar && (
          <View>
            <Calendar
              onDayPress={day => {
                setDate(dayjs(day.dateString));
                setShowCalendar(false);
              }}
              markedDates={{
                [date.format('YYYY-MM-DD')]: { selected: true, selectedColor: '#2a9d9f' },
              }}
              theme={{
                selectedDayBackgroundColor: '#2a9d9f',
                arrowColor: '#2a9d9f',
                todayTextColor: '#A64735',
              }}
              style={styles.calendar}
            />
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.verMais}>ver mais +</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.menu}>
          <TouchableOpacity
            style={[styles.menuButton, tipoSelecionado === 'Pendentes' && styles.menuButtonAtivo]}
            onPress={() => setTipoSelecionado('Pendentes')}
          >
            <Text style={[styles.menuText, tipoSelecionado === 'Pendentes' && styles.menuTextAtivo]}>
              Pendentes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, tipoSelecionado === 'Finalizadas' && styles.menuButtonAtivo]}
            onPress={() => setTipoSelecionado('Finalizadas')}
          >
            <Text style={[styles.menuText, tipoSelecionado === 'Finalizadas' && styles.menuTextAtivo]}>
              Finalizadas
            </Text>
          </TouchableOpacity>
        </View>

        <ListaDeTarefas date={date} label="Tarefas" tipo={tipoSelecionado} />
      </View>

      <Modal transparent animationType="none" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Criar Tarefa</Text>
            <Campo_Texto label="Título" placeholder="Digite o Título" value={titulo} onChangeText={setTitulo} />
            <Campo_Texto label="Descrição" value={descricao} onChangeText={setDescricao} placeholder="Digite a descrição" multiline />
            <Text style={styles.label}>Dificuldade</Text>
            <ModalSelector
              data={difficultyOptions}
              initValue={difficulty || "Selecione a dificuldade"}
              onChange={(option) => setDifficulty(option.key)}
            >
              <Text style={styles.modalSelectorText}>
                {difficulty ? difficultyOptions.find(o => o.key === difficulty)?.label : 'Selecione a dificuldade'}
              </Text>
            </ModalSelector>

            <View style={styles.checkboxContainer}>
              <Switch
                value={isDateChecked}
                onValueChange={setIsDateChecked}
                thumbColor={isDateChecked ? '#2a9d9f' : '#ccc'}
                trackColor={{ false: '#ccc', true: '#2a9d9f' }}
              />
              <Text style={styles.checkboxLabel}>Definir data de conclusão</Text>
            </View>

            {isDateChecked && (
              <View>
                <Text style={styles.label}>Data de conclusão</Text>
                <DateTimePicker
                  style={styles.datePicker}
                  value={editedDueDate}
                  mode="date"
                  display="spinner"
                  textColor="#000"
                  onChange={handleDateChange}
                />
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSalvarTarefa}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

    </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    marginVertical: 50,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    maxWidth: 500,
    gap: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2a9d9f',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    // marginBottom: 8,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalSelectorText: {
    padding: 10,
    color: '#333',
    fontSize: 16,
    backgroundColor: '#e5e5e5',
    borderRadius: 5,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80,
  },
  container: { alignItems: 'center', marginVertical: 10 },
  today: { fontWeight: 'bold', marginBottom: 8 },
  menu: {
    flexDirection: 'row',
    padding: 10,
    gap: 20,
    justifyContent:'center',
    marginBottom: 10,
    marginTop: 20,
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: '30%',
  },
  menuButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  menuButtonAtivo: {
    backgroundColor: '#2a9d9f',
  },
  menuText: {
    color: '#555',
    fontWeight: '500'
  },
  menuTextAtivo: {
    color: '#fff',
    fontWeight: 'bold'
  },
  navigator: { flexDirection: 'row', alignItems: 'center' },
  dateBox: {
    backgroundColor: '#2a9d9f',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  dateText: { color: '#fff', fontWeight: '500', width: '100%' },
  icon: {
    backgroundColor: '#2a9d9f',
    padding: 10,
    borderRadius: 10,
  },
  calendar: {
    marginTop: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 2,
    width: 350,
  },
  fab: {
    position: 'absolute',
    bottom : 100,
    // left: '91%',
    right: 20,
    backgroundColor: '#2a9d9f',
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
