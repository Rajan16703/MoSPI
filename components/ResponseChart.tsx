import { View, Text, StyleSheet } from 'react-native';

export function ResponseChart() {
  const chartData = [
    { day: 'Mon', responses: 340 },
    { day: 'Tue', responses: 298 },
    { day: 'Wed', responses: 425 },
    { day: 'Thu', responses: 387 },
    { day: 'Fri', responses: 456 },
    { day: 'Sat', responses: 289 },
    { day: 'Sun', responses: 203 },
  ];

  const maxResponses = Math.max(...chartData.map(d => d.responses));

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar,
                  { height: `${(item.responses / maxResponses) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.barLabel}>{item.day}</Text>
            <Text style={styles.barValue}>{item.responses}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    marginBottom: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '60%',
  },
  bar: {
    backgroundColor: '#1e40af',
    borderRadius: 4,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 8,
  },
  barValue: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
});