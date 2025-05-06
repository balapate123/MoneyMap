import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, fonts, colors } from '../styles/theme';

const TOGGLE_KEY = 'gpayAutoCapture';

const SettingsScreen = () => {
  const [gpayEnabled, setGpayEnabled] = useState(false);

  useEffect(() => {
    const loadToggle = async () => {
      const storedValue = await AsyncStorage.getItem(TOGGLE_KEY);
      if (storedValue !== null) {
        setGpayEnabled(storedValue === 'true');
      }
    };
    loadToggle();
  }, []);

  const toggleSwitch = async () => {
    const newValue = !gpayEnabled;
    setGpayEnabled(newValue);
    await AsyncStorage.setItem(TOGGLE_KEY, newValue.toString());
  };

  return (
    <View style={globalStyles.screen}>
      <Text style={fonts.largeTitle}>Settings</Text>
      <View style={styles.settingRow}>
        <Text style={fonts.body}>Enable Google Pay Auto-Expense Capture</Text>
        <Switch
          value={gpayEnabled}
          onValueChange={toggleSwitch}
          thumbColor={gpayEnabled ? colors.accent : '#ccc'}
          trackColor={{ false: '#334155', true: '#0EA5E9' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  settingRow: {
    marginTop: 20,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SettingsScreen;
