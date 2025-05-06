import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { globalStyles, fonts, colors } from '../styles/theme';
import EditExpenseModal from '../components/EditExpenseModal';
import { Ionicons } from '@expo/vector-icons';

interface Expense {
  _id: string;
  amount: number;
  category: string;
  note?: string;
  date: string;
}

const AllExpensesScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchAllExpenses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchAllExpenses(); // refresh after delete
    } catch (err) {
      console.error('Delete failed:', err);
      Alert.alert('Error', 'Could not delete expense');
    }
  };

  const openEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedExpense(null);
    setModalVisible(false);
    fetchAllExpenses();
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseRow}>
      <View style={{ flex: 1 }}>
        <Text style={fonts.body}>{item.category}</Text>
        <Text style={fonts.bodySecondary}>Note: {item.note || '—'}</Text>
        <Text style={fonts.bodySecondary}>Date: {new Date(item.date).toDateString()}</Text>
        <Text style={fonts.amount}>${item.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconButton}>
          <Ionicons name="create-outline" size={18} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.iconButton}>
          <Ionicons name="trash-outline" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={globalStyles.screen}>
      <Text style={fonts.largeTitle}>All Expenses</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 12 }}
        />
      )}

      <Modal visible={modalVisible} animationType="slide">
        {selectedExpense && (
          <EditExpenseModal expense={selectedExpense} onClose={closeModal} />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  expenseRow: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default AllExpensesScreen;
