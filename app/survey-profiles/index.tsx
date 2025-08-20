import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useMospiSurveyDetails } from '@/hooks/useMospiSurveyDetails';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';

export default function SurveyProfilesList() {
  const { data } = useMospiSurveyDetails();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>      
      <Text style={[styles.title, { color: colors.text }]}>All Survey Profiles</Text>
      <View style={styles.grid}>        
        {data.map(d => (
          <TouchableOpacity
            key={d.id}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push({ pathname: '/survey-profiles/[id]', params: { id: d.id } })}
            onLongPress={() => Linking.openURL(d.source)}
            activeOpacity={0.85}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>{d.title}</Text>
            <Text style={[styles.cardDomain, { color: colors.textSecondary }]} numberOfLines={2}>{d.domain} • {d.periodicity}</Text>
            <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={5}>{d.description}</Text>
            <View style={styles.badges}>
              {d.keyIndicators.slice(0,4).map(ind => (
                <View key={ind} style={[styles.badge, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '55' }]}>                  
                  <Text style={[styles.badgeText, { color: colors.primary }]}>{ind}</Text>
                </View>
              ))}
            </View>
            <Text style={[styles.latest, { color: colors.textSecondary }]}>Latest: {d.latestRelease}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', borderWidth: 1, borderRadius: 24, padding: 16, marginBottom: 18 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  cardDomain: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  cardDesc: { fontSize: 12, lineHeight: 18, marginBottom: 10 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  badge: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  latest: { fontSize: 11, fontStyle: 'italic' }
});
