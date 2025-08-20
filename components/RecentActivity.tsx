import { View, Text, StyleSheet } from 'react-native';
import { Clock, CircleCheck as CheckCircle, Database, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useMospiSurveys } from '@/hooks/useMospiSurveys';

export function RecentActivity() {
  const { colors } = useTheme();

  const { data: surveys, loading } = useMospiSurveys();

  const activities = loading ? [] : surveys.slice(0, 5).map((s, idx) => {
    const cycle = s.lastKnownCycle ? ` • Cycle: ${s.lastKnownCycle}` : '';
    const freq = s.frequency ? ` • Freq: ${s.frequency}` : '';
    const updated = s.lastUpdated ? ` • Updated: ${s.lastUpdated}` : '';
    return {
      id: idx,
      type: 'survey',
      message: `${s.title} – ${s.category}${cycle}${freq}${updated}`,
      time: 'synced',
      icon: Database,
      color: colors.primary,
    };
  });

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, alignItems: 'center' }]}>        
        <RefreshCw size={20} color={colors.textSecondary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontSize: 12 }}>Loading MoSPI survey metadata…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {activities.map((activity) => (
        <View key={activity.id} style={styles.activityItem}>
          <View style={[styles.iconContainer, { backgroundColor: activity.color + '15' }]}>
            <activity.icon size={16} color={activity.color} />
          </View>
          <View style={styles.activityContent}>
            <Text style={[styles.activityMessage, { color: colors.text }]}>{activity.message}</Text>
            <View style={styles.timeContainer}>
              <Clock size={12} color={colors.textSecondary} />
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>{activity.time}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 12,
    marginLeft: 4,
  },
});