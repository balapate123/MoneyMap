import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fonts, colors, globalStyles } from '../styles/theme';
import api from '../services/api';

interface Props {
  expense: {
    _id: string;
    amount: number;
    category: string;
    note?: string;
    date: string;
  };
  onClose: () => void;
}

const EditExpenseModal = ({ expense, onClose }: Props) => {
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState(expense.category);
  const [note, setNote] = useState(expense.note || '');
  const [date, setDate] = useState(new Date(expense.date));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    try {
      await api.put(`/expenses/${expense._id}`, {
        amount: parseFloat(amount),
        category,
        note,
        date,
      });

      Alert.alert('Updated!');
      onClose();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not update expense');
    }
  };

  return (
    <View style={[globalStyles.screen, { justifyContent: 'center' }]}>
      <Text style={fonts.largeTitle}>Edit Expense</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
        placeholderTextColor={colors.secondary}
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        placeholderTextColor={colors.secondary}
      />

      <TextInput
        style={styles.input}
        placeholder="Note"
        value={note}
        onChangeText={setNote}
        placeholderTextColor={colors.secondary}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBox}>
        <Text style={fonts.body}>📅 {date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            const current = selectedDate || date;
            setShowDatePicker(false);
            setDate(current);
          }}
        />
      )}

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: 'gray', marginTop: 12 }]}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  dateBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditExpenseModal;
