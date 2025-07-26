import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

export default function DateNavigatorWithCalendar() {
  const [date, setDate] = useState(dayjs());
  const [showCalendar, setShowCalendar] = useState(false);

  const previousDay = () => setDate(prev => prev.subtract(1, 'day'));
  const nextDay = () => setDate(prev => prev.add(1, 'day'));

  return (
    <View style={styles.container}>
      <Text style={styles.today}>HOJE</Text>

      <View style={styles.navigator}>
        <TouchableOpacity onPress={previousDay}>
          <Ionicons name="chevron-back" size={24} color="#fff" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>
              {date.format('dddd')} - {date.format('D')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={nextDay}>
          <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {showCalendar && (
        <Calendar
          onDayPress={day => {
            setDate(dayjs(day.dateString));
            setShowCalendar(false); // Fecha ao selecionar
          }}
          markedDates={{
            [date.format('YYYY-MM-DD')]: { selected: true, selectedColor: '#2a9d9f' }
          }}
          theme={{
            selectedDayBackgroundColor: '#2a9d9f',
            arrowColor: '#2a9d9f',
            todayTextColor: '#A64735',
          }}
          style={styles.calendar}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  today: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  navigator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBox: {
    backgroundColor: '#2a9d9f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
  },
  dateText: {
    color: '#fff',
    fontWeight: '500',
  },
  icon: {
    backgroundColor: '#2a9d9f',
    padding: 10,
    borderRadius: 10,
  },
  calendar: {
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
    width: 350, // ou ajuste conforme seu layout
  },
});
