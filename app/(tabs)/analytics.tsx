import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, TrendingUp, Users, TriangleAlert as AlertTriangle, Download, Filter, MapPin } from 'lucide-react-native';
import { AnalyticsCard } from '@/components/AnalyticsCard';
import { ResponseChart } from '@/components/ResponseChart';
import { QualityIndicators } from '@/components/QualityIndicators';

export default function AnalyticsScreen() {
  const metrics = [
    { title: 'Total Responses', value: '2,847', change: '+12%', trend: 'up', color: '#1e40af' },
    { title: 'Response Rate', value: '87%', change: '+5%', trend: 'up', color: '#059669' },
    { title: 'Avg. Completion Time', value: '7.2m', change: '-8%', trend: 'down', color: '#7c3aed' },
    { title: 'Quality Score', value: '94%', change: '+2%', trend: 'up', color: '#f59e0b' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Download size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <AnalyticsCard key={index} {...metric} />
          ))}
        </View>

        {/* Response Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Response Trends</Text>
          <ResponseChart />
        </View>

        {/* Quality Indicators */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Quality</Text>
          <QualityIndicators />
        </View>

        {/* Geographic Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Geographic Distribution</Text>
          <View style={styles.geoCard}>
            <View style={styles.geoHeader}>
              <MapPin size={20} color="#1e40af" />
              <Text style={styles.geoTitle}>Top Regions</Text>
            </View>
            <View style={styles.geoList}>
              {[
                { region: 'Delhi', responses: 547, percentage: 19 },
                { region: 'Maharashtra', responses: 423, percentage: 15 },
                { region: 'Karnataka', responses: 398, percentage: 14 },
                { region: 'Tamil Nadu', responses: 342, percentage: 12 },
                { region: 'Gujarat', responses: 287, percentage: 10 },
              ].map((item, index) => (
                <View key={index} style={styles.geoItem}>
                  <Text style={styles.geoRegion}>{item.region}</Text>
                  <View style={styles.geoStats}>
                    <Text style={styles.geoResponses}>{item.responses}</Text>
                    <View style={[styles.geoBar, { width: `${item.percentage * 5}%` }]} />
                    <Text style={styles.geoPercentage}>{item.percentage}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <TrendingUp size={20} color="#059669" />
              <Text style={styles.insightType}>Trend Analysis</Text>
            </View>
            <Text style={styles.insightText}>
              Response rates have increased by 23% in rural areas over the past month. 
              This improvement correlates with the deployment of multilingual surveys.
            </Text>
            <TouchableOpacity style={styles.insightAction}>
              <Text style={styles.insightActionText}>View Detailed Analysis</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <AlertTriangle size={20} color="#f59e0b" />
              <Text style={styles.insightType}>Quality Alert</Text>
            </View>
            <Text style={styles.insightText}>
              Detected unusual response patterns in "Employment Status" questions for West Bengal region. 
              Recommend additional validation or enumerator training.
            </Text>
            <TouchableOpacity style={styles.insightAction}>
              <Text style={styles.insightActionText}>Review Data</Text>
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
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  geoCard: {
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
  geoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  geoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  geoList: {
    gap: 12,
  },
  geoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  geoRegion: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  geoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    gap: 8,
  },
  geoResponses: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    minWidth: 40,
  },
  geoBar: {
    height: 6,
    backgroundColor: '#1e40af',
    borderRadius: 3,
    flex: 1,
    maxWidth: 80,
  },
  geoPercentage: {
    fontSize: 14,
    color: '#6b7280',
    minWidth: 32,
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
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
    gap: 8,
  },
  insightType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  insightText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightAction: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  insightActionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
});