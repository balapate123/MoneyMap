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
import api from '../services/api';
import { globalStyles, fonts, colors } from '../styles/theme';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const predefinedCategories = [
  'Food',
  'Transport',
  'Shopping',
  'Subscriptions',
  'Entertainment',
  'Health',
  'Rent',
  'Groceries',
  'Bills',
];

const AddExpenseScreen = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const allCategories = [...new Set([...predefinedCategories, category, customCategory])];

  const handleSubmit = async () => {
    const finalCategory = customCategory.trim() !== '' ? customCategory : category;

    if (!amount || !finalCategory) {
      Alert.alert('Missing fields', 'Amount and Category are required');
      return;
    }

    try {
      await api.post('/expenses', {
        amount: parseFloat(amount),
        category: finalCategory,
        note,
        date,
      });
      

      Alert.alert('Expense Added!');
      setAmount('');
      setCategory('');
      setCustomCategory('');
      setNote('');
      setDate(new Date());
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add expense');
    }
  };

  return (
    <View style={globalStyles.screen}>
      <Text style={fonts.largeTitle}>Add Expense</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor={colors.secondary}
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      />

      <View style={styles.dropdownWrapper}>
        <Text style={fonts.subtitle}>Select a Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
            style={styles.picker}
            dropdownIconColor="#E2E8F0"
            mode="dropdown"
            itemStyle={{
              color: '#E2E8F0',
              fontSize: 16,
            }}
          >
            <Picker.Item label="Choose a category" value="" />
            {predefinedCategories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Or type a custom category (e.g., Gym)"
        placeholderTextColor={colors.secondary}
        value={customCategory}
        onChangeText={setCustomCategory}
      />

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.dateBox}
      >
        <Text style={fonts.body}>📅 {date.toDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            if (event.type !== 'dismissed') {
              const currentDate = selectedDate || date;
              setDate(currentDate);
            }
            setShowPicker(false);
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Note (optional)"
        placeholderTextColor={colors.secondary}
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Expense</Text>
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
  dropdownWrapper: {
    marginBottom: 16,
  },
  pickerWrapper: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  picker: {
    color: '#E2E8F0',
    fontSize: 16,
    paddingHorizontal: 10,
    height: 50,
    width: '100%',
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
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddExpenseScreen;
