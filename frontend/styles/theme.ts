import { StyleSheet, TextStyle } from 'react-native';

export const colors = {
  background: '#0F172A', // dark navy
  card: '#1E293B',       // darker card
  text: '#3B82F6',        // light text
  accent: '#3B82F6',      // blue accent
  secondary: '#94A3B8',   // muted gray-blue
};

export const fonts = {
    largeTitle: {
      fontSize: 28,
      fontWeight: 'bold' as TextStyle['fontWeight'],
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: colors.secondary,
    },
    body: {
      fontSize: 14,
      color: colors.text,
    },
    amount: {
      fontSize: 22,
      fontWeight: '600' as TextStyle['fontWeight'],
      color: colors.text,
    },
    bodySecondary: {
      fontSize: 14,
      color: '#94A3B8', // softer gray-blue tone for secondary info
    },
  };
  

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  dateBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  
});
