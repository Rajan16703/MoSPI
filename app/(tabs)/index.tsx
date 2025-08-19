import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, Users, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Globe, Zap } from 'lucide-react-native';
import { StatusCard } from '@/components/StatusCard';
import { QuickActionCard } from '@/components/QuickActionCard';
import { RecentActivity } from '@/components/RecentActivity';

export default function HomeScreen() {
  const stats = [
    { title: 'Active Surveys', value: '12', icon: BarChart3, color: '#1e40af' },
    { title: 'Responses Today', value: '847', icon: Users, color: '#059669' },
    { title: 'Avg. Time', value: '8.5m', icon: Clock, color: '#dc2626' },
    { title: 'Completion Rate', value: '94%', icon: CheckCircle, color: '#7c3aed' },
  ];

  const quickActions = [
    { title: 'Create Survey', subtitle: 'AI-powered builder', icon: Zap, color: '#1e40af' },
    { title: 'Quality Check', subtitle: 'Review responses', icon: AlertTriangle, color: '#f59e0b' },
    { title: 'Multi-language', subtitle: 'Translate surveys', icon: Globe, color: '#059669' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.title}>MoSPI Survey Dashboard</Text>
          </View>
          <View style={styles.syncStatus}>
            <View style={styles.syncDot} />
            <Text style={styles.syncText}>Online</Text>
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
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Zap size={20} color="#7c3aed" />
              <Text style={styles.insightTitle}>Quality Alert</Text>
            </View>
            <Text style={styles.insightText}>
              Survey "Household Income 2024" shows 15% higher response time in rural areas. 
              Consider simplifying questions 7-12 for better accessibility.
            </Text>
            <TouchableOpacity style={styles.insightButton}>
              <Text style={styles.insightButtonText}>View Details</Text>
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
    backgroundColor: '#f8fafc',
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
    color: '#6b7280',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 4,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  syncText: {
    fontSize: 12,
    color: '#059669',
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
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  insightCard: {
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
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  insightButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
});