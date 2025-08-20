import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useMospiSurveyDetails } from '@/hooks/useMospiSurveyDetails';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, ExternalLink } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SurveyProfileDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useMospiSurveyDetails();
  const detail = data.find(d => d.id === id);
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <ArrowLeft size={18} color={colors.text} />
        <Text style={{ color: colors.text, fontWeight: '600', marginLeft: 6 }}>Back</Text>
      </TouchableOpacity>
      {!detail && (
        <Text style={{ color: colors.textSecondary }}>Profile not found.</Text>
      )}
      {detail && (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>          
          <Text style={[styles.title, { color: colors.text }]}>{detail.title}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>{detail.domain} • {detail.periodicity}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{detail.description}</Text>
          <Text style={[styles.subheading, { color: colors.text }]}>Key Indicators</Text>
          <View style={styles.badges}>
            {detail.keyIndicators.map(ind => (
              <View key={ind} style={[styles.badge, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '55' }]}>                
                <Text style={[styles.badgeText, { color: colors.primary }]}>{ind}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.latest, { color: colors.textSecondary }]}>Latest Release: {detail.latestRelease}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(detail.source)} style={[styles.linkBtn, { backgroundColor: colors.primary }]}>            
            <ExternalLink size={16} color="#fff" />
            <Text style={styles.linkText}>Open Source Page</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  card: { borderWidth: 1, borderRadius: 28, padding: 20 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  meta: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 14 },
  description: { fontSize: 14, lineHeight: 22, marginBottom: 20 },
  subheading: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  badge: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  latest: { fontSize: 12, fontStyle: 'italic', marginBottom: 20 },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, alignSelf: 'flex-start' },
  linkText: { color: '#fff', fontWeight: '600', marginLeft: 6 }
});
