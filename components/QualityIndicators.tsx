import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Clock, Target } from 'lucide-react-native';

export function QualityIndicators() {
  const indicators = [
    {
      title: 'Response Consistency',
      value: '94%',
      status: 'good',
      icon: CheckCircle,
      description: 'Responses show consistent patterns',
    },
    {
      title: 'Completion Rate',
      value: '87%',
      status: 'good',
      icon: Target,
      description: 'High completion across all questions',
    },
    {
      title: 'Average Time',
      value: '7.2m',
      status: 'warning',
      icon: Clock,
      description: 'Slightly higher than expected',
    },
    {
      title: 'Quality Flags',
      value: '12',
      status: 'warning',
      icon: AlertTriangle,
      description: 'Responses flagged for review',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#059669';
      case 'warning': return '#f59e0b';
      case 'error': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      {indicators.map((indicator, index) => (
        <View key={index} style={styles.indicatorCard}>
          <View style={styles.indicatorHeader}>
            <View style={[styles.iconContainer, { backgroundColor: getStatusColor(indicator.status) + '15' }]}>
              <indicator.icon size={18} color={getStatusColor(indicator.status)} />
            </View>
            <View style={styles.indicatorContent}>
              <Text style={styles.indicatorTitle}>{indicator.title}</Text>
              <Text style={styles.indicatorDescription}>{indicator.description}</Text>
            </View>
            <Text style={[styles.indicatorValue, { color: getStatusColor(indicator.status) }]}>
              {indicator.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  indicatorCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  indicatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indicatorContent: {
    flex: 1,
  },
  indicatorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  indicatorDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});