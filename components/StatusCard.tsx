import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface StatusCardProps {
  title: string;
  value: string;
  icon: typeof LucideIcon;
  color: string;
  subtitle?: string;
  trend?: number[]; // 0..1 values for mini spark bars
  onPress?: () => void;
}

export function StatusCard({ title, value, icon: Icon, color, subtitle, trend, onPress }: StatusCardProps) {
  const { colors } = useTheme();
  const scale = new Animated.Value(1);

  const startPress = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  };
  const endPress = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  };
  const Wrapper: any = onPress ? TouchableWithoutFeedback : View;

  return (
    <Wrapper
      {...(onPress ? { onPress, onPressIn: startPress, onPressOut: endPress } : {})}
    >
      <Animated.View style={[
        styles.card,
        { transform: [{ scale }], backgroundColor: colors.surface, borderColor: colors.border }
      ]}>
        <View style={styles.row}>
          <View style={[styles.iconCircle, { backgroundColor: color + '22' }]}> 
            <Icon size={26} color={color} />
          </View>
          {trend && trend.length > 0 && (
            <View style={styles.trendRow}>
              {trend.slice(-6).map((v, i) => (
                <View key={i} style={[styles.trendBar, { height: 8 + v * 22, backgroundColor: color + 'aa' }]} />
              ))}
            </View>
          )}
        </View>
        <Text style={[styles.value, { color: colors.text }]} numberOfLines={1}>{value}</Text>
        <Text style={[styles.title, { color: colors.textSecondary }]} numberOfLines={2}>{title}</Text>
  {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>{subtitle}</Text>}
      </Animated.View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    width: '48%',
    minHeight: 140,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 30 },
  trendBar: { width: 5, borderRadius: 3 },
  value: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.85,
  },
  subtitle: { fontSize: 11, fontWeight: '500', marginTop: 4 },
});