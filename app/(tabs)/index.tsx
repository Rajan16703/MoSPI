import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, Users, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Globe, Zap, Database, ExternalLink } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StatusCard } from '@/components/StatusCard';
import { QuickActionCard } from '@/components/QuickActionCard';
import { RecentActivity } from '@/components/RecentActivity';
import { useMospiSurveys } from '@/hooks/useMospiSurveys';
import { useMospiSurveyDetails } from '@/hooks/useMospiSurveyDetails';
import { useRouter } from 'expo-router';
import { useSurvey } from '@/contexts/SurveyContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { questions } = useSurvey();

  const { data: surveyMeta } = useMospiSurveys();
  const { data: surveyDetails } = useMospiSurveyDetails();
  const router = useRouter();
  const stats = [
    { title: 'Datasets Loaded', value: String(surveyMeta.length), subtitle: 'official metadata', icon: Database, color: colors.primary, onPress: () => {} },
    { title: 'Detailed Profiles', value: String(surveyDetails.length), subtitle: 'expanded detail', icon: BarChart3, color: colors.success, onPress: () => router.push('/survey-profiles/index') },
    { title: 'Demo Responses', value: '—', subtitle: 'sample set', icon: Users, color: colors.warning, onPress: () => router.push('/survey') },
    { title: 'Sync Status', value: 'OK', subtitle: 'last 5 min', icon: CheckCircle, color: '#7c3aed', onPress: () => {} },
  ];

  const quickActions = [
    { title: 'Create Survey', subtitle: 'AI-powered builder', icon: Zap, color: colors.primary },
    { title: 'Quality Check', subtitle: 'Review responses', icon: AlertTriangle, color: colors.warning },
    { title: 'Multi-language', subtitle: 'Translate surveys', icon: Globe, color: colors.success },
    { title: 'OCR Scanning', subtitle: 'Extract text from forms', icon: Database, color: colors.primary },
    { title: 'Real-time Analytics', subtitle: 'Live response trends', icon: BarChart3, color: colors.success },
    { title: 'Biometric Verify', subtitle: 'Secure respondent auth', icon: CheckCircle, color: '#f59e0b' },
    { title: 'AI Summaries', subtitle: 'Theme open responses', icon: Zap, color: '#7c3aed' },
    { title: 'Offline Capture', subtitle: 'Sync when online', icon: Globe, color: '#10b981' },
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

        {/* Summary Bar */}
        <View style={[styles.summaryBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>          
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {surveyMeta.length} Datasets • {surveyDetails.length} Profiles • Sync OK
          </Text>
        </View>
        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <StatusCard key={index} {...stat} trend={[0.2,0.4,0.3,0.6,0.8,0.7]} />
          ))}
        </View>

        {/* Ongoing Survey */}
        <View style={styles.section}>
          <Text style={[styles.headingLabel, { color: colors.textSecondary }]}>📝 Ongoing Survey</Text>
          <View style={[styles.ongoingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>            
            {questions.length > 0 ? (
              <>
                <Text style={[styles.ongoingPrimary, { color: colors.text }]} numberOfLines={2}>Draft in progress with {questions.length} question{questions.length!==1?'s':''}</Text>
                <Text style={[styles.ongoingMeta, { color: colors.textSecondary }]}>Keep building or review quality & analytics.</Text>
                <View style={styles.ongoingActionsRow}>
                  <TouchableOpacity onPress={() => router.push('/survey')} style={[styles.ongoingBtn, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '55' }]}>                    
                    <Text style={[styles.ongoingBtnText, { color: colors.primary }]}>Continue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/analytics')} style={[styles.ongoingBtn, { backgroundColor: colors.success + '22', borderColor: colors.success + '55' }]}>                    
                    <Text style={[styles.ongoingBtnText, { color: colors.success }]}>Analytics</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.ongoingPrimary, { color: colors.text }]}>No active draft</Text>
                <Text style={[styles.ongoingMeta, { color: colors.textSecondary }]}>Start a new AI‑assisted survey build.</Text>
                <View style={styles.ongoingActionsRow}>
                  <TouchableOpacity onPress={() => router.push('/survey')} style={[styles.ongoingBtn, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '55' }]}>                    
                    <Text style={[styles.ongoingBtnText, { color: colors.primary }]}>Create</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.headingLabel, { color: colors.textSecondary }]}>⭐ Features</Text>
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

        {/* Official Resources */}
        <View style={styles.section}>
          <Text style={[styles.headingLabel, { color: colors.textSecondary }]}>🏛️ Official Survey Links</Text>
          <Text style={styles.sectionTitle}>Official MoSPI Resources</Text>
          <View style={{ gap: 8 }}>
            {[
              { label: 'Download Reports', url: 'https://mospi.gov.in/download-reports' },
              { label: 'Current Surveys', url: 'https://mospi.gov.in/current-surveys-0' },
              { label: 'Data Portal (data.gov.in)', url: 'https://data.gov.in' },
            ].map(link => (
              <TouchableOpacity
                key={link.url}
                onPress={() => Linking.openURL(link.url)}
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}
              >
                <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 13 }}>{link.label}</Text>
                <ExternalLink size={14} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

  {/* Removed separate planned features section (integrated into Quick Actions) */}

        {/* Survey Profiles */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Survey Profiles</Text>
            <TouchableOpacity onPress={() => router.push('/survey-profiles/index')}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
            {surveyDetails.map(detail => (
              <TouchableOpacity
                key={detail.id}
                onPress={() => router.push({ pathname: '/survey-profiles/[id]', params: { id: detail.id } })}
                onLongPress={() => Linking.openURL(detail.source)}
                style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                activeOpacity={0.85}
              >                
                <Text style={[styles.profileTitle, { color: colors.text }]} numberOfLines={2}>{detail.title}</Text>
                <Text style={[styles.profileDomain, { color: colors.textSecondary }]} numberOfLines={2}>{detail.domain} • {detail.periodicity}</Text>
                <Text style={[styles.profileDesc, { color: colors.textSecondary }]} numberOfLines={4}>{detail.description}</Text>
                <View style={styles.badgeRow}>
                  {detail.keyIndicators.slice(0,3).map(ind => (
                    <View key={ind} style={[styles.badge, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '55' }]}>                      
                      <Text style={[styles.badgeText, { color: colors.primary }]}>{ind}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[styles.releaseText, { color: colors.textSecondary }]}>Latest: {detail.latestRelease}</Text>
                  <ExternalLink size={14} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    gap: 18,
    marginTop: 12,
  },
  summaryBar: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginTop: 8,
  },
  summaryText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  headingLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  ongoingCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
  },
  ongoingPrimary: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  ongoingMeta: { fontSize: 12, fontWeight: '600', marginBottom: 14, letterSpacing: 0.5 },
  ongoingActionsRow: { flexDirection: 'row', gap: 12 },
  ongoingBtn: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 10 },
  ongoingBtnText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
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
  profileCard: {
    width: 260,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileDomain: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  releaseText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 20 },
  featureCard: { width: '48%', borderWidth: 1, borderRadius: 18, padding: 16, minHeight: 140 },
  featureIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  featureTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  featureSubtitle: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
});