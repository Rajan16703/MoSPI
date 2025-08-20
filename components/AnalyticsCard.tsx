import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

export function AnalyticsCard({ title, value, change, trend, color }: AnalyticsCardProps) {
  const { colors, isDark } = useTheme();
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? '#059669' : '#dc2626';

  return (
    <View style={[styles.card, { width: '48%', backgroundColor: colors.surface, borderColor: colors.border }]}> 
      <Text style={[styles.title,{ color: colors.textSecondary }]}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <View style={styles.trend}>
        <TrendIcon size={14} color={trendColor} />
        {!!change && <Text style={[styles.change, { color: trendColor }]}>{change}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 1 },
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