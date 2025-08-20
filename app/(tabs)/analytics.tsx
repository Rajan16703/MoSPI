import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, TrendingUp, Users, TriangleAlert as AlertTriangle, Download, Filter, MapPin, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { AnalyticsCard } from '@/components/AnalyticsCard';
import { ResponseChart } from '@/components/ResponseChart';
import { QualityIndicators } from '@/components/QualityIndicators';
import { useMospiReports } from '@/hooks/useMospiReports';
import { useResponses } from '@/contexts/ResponseContext';
import { useParadata } from '@/contexts/ParadataContext';
import { useSurvey } from '@/contexts/SurveyContext';
import { useOCR } from '@/contexts/OCRContext';
import { useSummarization } from '@/contexts/SummarizationContext';
import { useBiometric } from '@/contexts/BiometricContext';

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const maxWidth = 1100; const pad = 20; const screenWidth = Dimensions.get('window').width; const centerW = { width: Math.min(screenWidth - pad*2, maxWidth) };
  const { reports, loading: reportsLoading, error: reportsError, fetchedAt } = useMospiReports();
  const { ordered } = useResponses();
  const { summary: paradata } = useParadata();
  const { questions } = useSurvey();
  const { pickAndScan } = useOCR();
  const { summarize, summaries, loading: summarizing } = useSummarization();
  const { session, verify } = useBiometric();

  // Derive real metrics
  const totalResponses = ordered.length;
  const uniqueQuestionsAnswered = new Set(ordered.map(r => r.questionId)).size;
  const responseRate = questions.length ? (uniqueQuestionsAnswered / questions.length) : 0;
  const avgDurationMs = paradata.records.length
    ? Math.round(paradata.records.filter(r=>r.durationMs).reduce((a,r)=>a+(r.durationMs||0),0) / paradata.records.length)
    : 0;
  const avgSeconds = avgDurationMs / 1000;
  const completionMinutes = paradata.totalDurationMs ? (paradata.totalDurationMs/60000).toFixed(1) : (avgSeconds/60).toFixed(1);
  const qualityFast = paradata.quality.fast;
  const qualityFlagged = paradata.quality.flagged;
  const answeredToday = ordered.filter(r => Date.now() - r.answeredAt < 86400000).length;
  const answeredYesterday = ordered.filter(r => {
    const diff = Date.now() - r.answeredAt; return diff >= 86400000 && diff < 2*86400000; }).length;
  const dayChange = answeredYesterday ? ((answeredToday - answeredYesterday)/answeredYesterday) : (answeredToday?1:0);
  const changePct = (v:number)=> (v>0?'+':'') + Math.round(v*100) + '%';
  const metrics: { title: string; value: string; change: string; trend: 'up' | 'down'; color: string; }[] = [
    { title: 'Questions Answered', value: String(totalResponses), change: changePct(dayChange), trend: dayChange>=0?'up':'down', color: colors.primary },
    { title: 'Response Rate', value: questions.length? Math.round(responseRate*100)+'%':'—', change: '', trend: 'up', color: colors.success },
    { title: 'Avg. Q Time', value: avgSeconds? (avgSeconds.toFixed(1)+'s'):'—', change: '', trend: 'down', color: '#7c3aed' },
    { title: 'Fast / Flagged', value: qualityFast + ' / ' + qualityFlagged, change: '', trend: 'up', color: colors.warning },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { justifyContent: 'center' }]}>
        <View style={[styles.headerInner, centerW]}> 
        <Text style={[styles.headerTitle, { color: colors.text }]}>Analytics Dashboard</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Filter size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Download size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingBottom: 80 }}>
        {/* Feature Actions */}
        <View style={[centerW, { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20, marginTop: 8 }]}> 
          <TouchableOpacity onPress={pickAndScan} style={[styles.headerButton,{ backgroundColor: colors.surface, borderColor: colors.border, width: 120 }]}> 
            <Text style={{ fontSize:11, color: colors.textSecondary, fontWeight:'600', textAlign:'center' }}>OCR Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => verify('face')} style={[styles.headerButton,{ backgroundColor: session? colors.success: colors.surface, borderColor: colors.border, width: 140 }]}> 
            <Text style={{ fontSize:11, color: session? '#000': colors.textSecondary, fontWeight:'600', textAlign:'center' }}>{session? 'Verified':'Biometric Verify'}</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={summarizing} onPress={summarize} style={[styles.headerButton,{ backgroundColor: summarizing? colors.border: colors.surface, borderColor: colors.border, width: 140 }]}> 
            <Text style={{ fontSize:11, color: colors.textSecondary, fontWeight:'600', textAlign:'center' }}>{ summarizing? 'Summarizing...':'AI Summarize'}</Text>
          </TouchableOpacity>
        </View>
        {/* Key Metrics */}
        <View style={[styles.metricsGrid, centerW, { backgroundColor: 'transparent' }]}>
          {metrics.map((metric, index) => (
            <AnalyticsCard key={index} {...metric} />
          ))}
        </View>

        {/* Response Chart */}
        <View style={[styles.section, centerW] }>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Response Trends</Text>
          <ResponseChart />
        </View>

        {/* Quality Indicators */}
  <View style={[styles.section, centerW]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Quality</Text>
          <QualityIndicators />
        </View>

        {/* Geographic Distribution */}
  <View style={[styles.section, centerW]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Geographic Distribution</Text>
          <View style={[styles.geoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.geoHeader}>
              <MapPin size={20} color={colors.primary} />
              <Text style={[styles.geoTitle, { color: colors.text }]}>Top Regions</Text>
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
                  <Text style={[styles.geoRegion, { color: colors.text }]}>{item.region}</Text>
                  <View style={styles.geoStats}>
                    <Text style={[styles.geoResponses, { color: colors.text }]}>{item.responses}</Text>
                    <View style={[styles.geoBar, { width: `${item.percentage * 5}%`, backgroundColor: colors.primary }]} />
                    <Text style={[styles.geoPercentage, { color: colors.textSecondary }]}>{item.percentage}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* AI Insights */}
  <View style={[styles.section, centerW]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Insights</Text>
          <View style={[styles.insightCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.insightHeader}>
              <TrendingUp size={20} color={colors.success} />
              <Text style={[styles.insightType, { color: colors.text }]}>Trend Analysis</Text>
            </View>
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              Response rates have increased by 23% in rural areas over the past month. 
              This improvement correlates with the deployment of multilingual surveys.
            </Text>
            <TouchableOpacity style={[styles.insightAction, { backgroundColor: colors.background }]}>
              <Text style={[styles.insightActionText, { color: colors.text }]}>View Detailed Analysis</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.insightCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.insightHeader}>
              <AlertTriangle size={20} color={colors.warning} />
              <Text style={[styles.insightType, { color: colors.text }]}>Quality Alert</Text>
            </View>
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              Detected unusual response patterns in "Employment Status" questions for West Bengal region. 
              Recommend additional validation or enumerator training.
            </Text>
            <TouchableOpacity style={[styles.insightAction, { backgroundColor: colors.background }]}>
              <Text style={[styles.insightActionText, { color: colors.text }]}>Review Data</Text>
            </TouchableOpacity>
          </View>
        </View>
        {summaries.length>0 && (
          <View style={[styles.section, centerW]}>
            <Text style={[styles.sectionTitle,{color:colors.text}]}>Latest Summaries</Text>
            {summaries.slice(0,3).map(s => (
              <View key={s.id} style={[styles.reportsCard,{ backgroundColor: colors.surface, borderColor: colors.border }]}> 
                <Text style={{ fontSize:12, color: colors.textSecondary, marginBottom:4 }}>Sample: {s.sampleSize}</Text>
                <Text style={{ fontSize:14, color: colors.text }}>{s.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Live MoSPI Reports (scraped) */}
  <View style={[styles.section, centerW]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest Official Reports</Text>
          <View style={[styles.reportsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {reportsLoading && (
              <View style={styles.centerRow}><ActivityIndicator color={colors.primary} /><Text style={[styles.loadingText,{color:colors.textSecondary}]}>  Fetching reports...</Text></View>
            )}
            {reportsError && <Text style={[styles.errorText,{color:'#dc2626'}]}>Failed: {reportsError}</Text>}
            {!reportsLoading && !reportsError && reports.slice(0,8).map(r => (
              <TouchableOpacity key={r.url} style={styles.reportRow} onPress={() => Linking.openURL(r.url)}>
                <ExternalLink size={14} color={colors.primary} />
                <Text style={[styles.reportTitle,{color:colors.primary}]} numberOfLines={2}>{r.title}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.reportFooter}>
              <Text style={[styles.reportMeta,{color:colors.textSecondary}]}>Total {reports.length} • Updated {fetchedAt?fetchedAt.toLocaleTimeString():''}</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://mospi.gov.in/download-reports')}>
                <Text style={[styles.reportLink,{color:colors.primary}]}>Open Portal</Text>
              </TouchableOpacity>
            </View>
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
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
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
    marginBottom: 16,
  },
  geoCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
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
    minWidth: 40,
  },
  geoBar: {
    height: 6,
    borderRadius: 3,
    flex: 1,
    maxWidth: 80,
  },
  geoPercentage: {
    fontSize: 14,
    minWidth: 32,
  },
  insightCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
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
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  insightAction: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  insightActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reportsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  reportTitle: { flex: 1, fontSize: 12, fontWeight: '600' },
  reportFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  reportMeta: { fontSize: 10 },
  reportLink: { fontSize: 12, fontWeight: '600' },
  loadingText: { fontSize: 12 },
  centerRow: { flexDirection: 'row', alignItems: 'center' },
  errorText: { fontSize: 12 },
});