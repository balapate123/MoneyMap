import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { colors } from '../styles/theme';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: colors.card,
  backgroundGradientFrom: colors.card,
  backgroundGradientTo: colors.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 246, 255, ${opacity})`,
  labelColor: () => '#fff',
};

const colorsArr = ['#00F6FF', '#00D9A0', '#9477F9', '#FF5C8A', '#FFAD5C'];

// 1. Define the props interface
interface DashboardChartProps {
  token: string;
  refreshKey: number; // summaryRefreshKey is Date.now(), which is a number
}

// 2. Update the component signature to use the new props interface
const DashboardChart = ({ token, refreshKey }: DashboardChartProps) => {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [dailyLabels, setDailyLabels] = useState<string[]>([]);
  const [dailyAmounts, setDailyAmounts] = useState<number[]>([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        console.log('In Dashboard token:', token, 'Refresh Key:', refreshKey); // Log refreshKey for debugging
        const res = await axios.get('http://localhost:5000/api/expenses/summary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { categoryTotals, dailyTotals } = res.data;

        // Format pie chart
        const pie = Object.entries(categoryTotals).map(([cat, amt], i) => ({
          name: cat,
          population: amt,
          color: colorsArr[i % colorsArr.length],
          legendFontColor: '#E2E8F0', // softer white
          legendFontSize: 16,
        }));

        setCategoryData(pie);

        // Format line chart
        const labels = dailyTotals.map((d: any) => d.date.slice(5)); // MM-DD
        const amounts = dailyTotals.map((d: any) => d.total);

        setDailyLabels(labels);
        setDailyAmounts(amounts);
      } catch (err) {
        console.error('Error loading dashboard summary:', err);
      }
    };

    if (token) {
      fetchSummary();
    }
    // 3. Add refreshKey to the dependency array
  }, [token, refreshKey]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending by Category</Text>
      {categoryData.length > 0 ? (
        <PieChart
          data={categoryData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      ) : (
        <Text style={styles.placeholder}>No category data available</Text>
      )}

      <Text style={styles.title}>Spending Over Time</Text>
      {dailyAmounts.length > 0 ? (
        <LineChart
          data={{
            labels: dailyLabels,
            datasets: [{ data: dailyAmounts }],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      ) : (
        <Text style={styles.placeholder}>No daily data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  placeholder: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default DashboardChart;
