import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, Users, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Globe, Zap } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StatusCard } from '@/components/StatusCard';
import { QuickActionCard } from '@/components/QuickActionCard';
import { RecentActivity } from '@/components/RecentActivity';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const stats = [
    { title: 'Active Surveys', value: '12', icon: BarChart3, color: colors.primary },
    { title: 'Responses Today', value: '847', icon: Users, color: colors.success },
    { title: 'Avg. Time', value: '8.5m', icon: Clock, color: colors.error },
    { title: 'Completion Rate', value: '94%', icon: CheckCircle, color: '#7c3aed' },
  ];

  const quickActions = [
    { title: 'Create Survey', subtitle: 'AI-powered builder', icon: Zap, color: colors.primary },
    { title: 'Quality Check', subtitle: 'Review responses', icon: AlertTriangle, color: colors.warning },
    { title: 'Multi-language', subtitle: 'Translate surveys', icon: Globe, color: colors.success },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good Morning, {user?.name}</Text>
            <Text style={[styles.title, { color: colors.text }]}>MoSPI Survey Dashboard</Text>
          </View>
          <View style={styles.headerActions}>
            <View style={[styles.syncStatus, { backgroundColor: colors.success + '15' }]}>
              <View style={[styles.syncDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.syncText, { color: colors.success }]}>Online</Text>
            </View>
            <ThemeToggle />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <StatusCard key={index} {...stat} />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <RecentActivity />
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Insights</Text>
          <View style={[styles.insightCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.insightHeader}>
              <Zap size={20} color="#7c3aed" />
              <Text style={[styles.insightTitle, { color: colors.text }]}>Quality Alert</Text>
            </View>
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              Survey "Household Income 2024" shows 15% higher response time in rural areas. 
              Consider simplifying questions 7-12 for better accessibility.
            </Text>
            <TouchableOpacity style={[styles.insightButton, { backgroundColor: colors.background }]}>
              <Text style={[styles.insightButtonText, { color: colors.text }]}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insightCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  insightButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  insightButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});