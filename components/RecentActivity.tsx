import { View, Text, StyleSheet } from 'react-native';
import { Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, User } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function RecentActivity() {
  const { colors } = useTheme();

  const activities = [
    {
      id: 1,
      type: 'completion',
      message: 'Survey "Urban Planning 2024" completed by 156 respondents',
      time: '2 hours ago',
      icon: CheckCircle,
      color: colors.success,
    },
    {
      id: 2,
      type: 'quality',
      message: 'Quality alert: Unusual response pattern detected in Delhi region',
      time: '4 hours ago',
      icon: AlertTriangle,
      color: colors.warning,
    },
    {
      id: 3,
      type: 'user',
      message: 'New enumerator assigned to Karnataka region',
      time: '6 hours ago',
      icon: User,
      color: colors.primary,
    },
  ];

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