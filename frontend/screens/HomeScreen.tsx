import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';
import { globalStyles, fonts, colors } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import EditExpenseModal from '../components/EditExpenseModal';
import DashboardChart from '../components/DashboardChart';

interface Expense {
  amount: number;
  category: string;
  note?: string;
  date: string;
  _id: string;
}

const HomeScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userToken, setUserToken] = useState<string>('');
  const [summaryRefreshKey, setSummaryRefreshKey] = useState(Date.now());

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      if (token) setUserToken(token);
    });
  }, []);

  const triggerSummaryRefresh = () => {
    setSummaryRefreshKey(Date.now());
  };

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      const fetched = res.data;
      setExpenses(fetched);
      const totalAmount = fetched.reduce((sum: number, e: Expense) => sum + e.amount, 0);
      setTotal(totalAmount);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Logged out');
    navigation.navigate('Login');
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
      triggerSummaryRefresh(); // 🔄 refresh chart
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedExpense(null);
    setModalVisible(false);
    fetchExpenses();
    triggerSummaryRefresh(); // 🔄 refresh chart
  };

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
      triggerSummaryRefresh(); // ⬅️ Add this here too
    }, [])
  );
  

  return (
    <ScrollView style={globalStyles.screen}>
      <Text style={fonts.largeTitle}>Dashboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <>
          <View style={globalStyles.card}>
            <Text style={fonts.subtitle}>Total Spent</Text>
            <Text style={fonts.amount}>${total.toFixed(2)}</Text>
          </View>

          <View style={globalStyles.card}>
            <Text style={fonts.subtitle}>Latest Expenses</Text>
            {expenses.slice(0, 5).map((expense) => (
              <View key={expense._id} style={styles.expenseRow}>
                <View style={{ flex: 1 }}>
                  <Text style={fonts.body}>{expense.category}</Text>
                  <Text style={fonts.body}>{expense.note}</Text>
                  <Text style={fonts.body}>${expense.amount}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => openEditModal(expense)} style={styles.iconButton}>
                    <Ionicons name="create-outline" size={18} color={colors.accent} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(expense._id)} style={styles.iconButton}>
                    <Ionicons name="trash-outline" size={18} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View style={globalStyles.card}>
            <Text style={fonts.subtitle}>Spending Summary</Text>
            <DashboardChart token={userToken} refreshKey={summaryRefreshKey} />
          </View>
        </>
      )}

      <TouchableOpacity onPress={handleLogout} style={styles.logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        {selectedExpense && (
          <EditExpenseModal expense={selectedExpense} onClose={closeModal} />
        )}
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    marginLeft: 10,
  },
  logout: {
    marginTop: 30,
    alignSelf: 'center',
    padding: 10,
  },
  logoutText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
