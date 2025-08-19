import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

export function AnalyticsCard({ title, value, change, trend, color }: AnalyticsCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? '#059669' : '#dc2626';

  return (
    <View style={[styles.card, { width: '48%' }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <View style={styles.trend}>
        <TrendIcon size={14} color={trendColor} />
        <Text style={[styles.change, { color: trendColor }]}>{change}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  title: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
});