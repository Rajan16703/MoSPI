import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Wand as Wand2, Library, Save, Eye, Settings2, Download } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SurveyBuilder } from '@/components/SurveyBuilder';
import { QuestionLibrary } from '@/components/QuestionLibrary';
import { AIPromptInput } from '@/components/AIPromptInput';
import { SurveyExportModal } from '@/components/SurveyExportModal';

export default function CreateScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'builder' | 'ai' | 'library'>('builder');
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [exportVisible, setExportVisible] = useState(false);

  const tabs = [
    { id: 'builder', title: 'Builder', icon: Settings2 },
    { id: 'ai', title: 'AI Generate', icon: Wand2 },
    { id: 'library', title: 'Library', icon: Library },
  ];

  const handleSaveSurvey = () => {
    Alert.alert('Success', 'Survey saved successfully!');
  };

  const handlePreviewSurvey = () => {
    Alert.alert('Preview', 'Opening survey preview...');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerKicker, { color: colors.primary }]}>Builder</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Create Survey</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handlePreviewSurvey}>
            <Eye size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Export Survey" style={[styles.headerButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => setExportVisible(true)}>
            <Download size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSaveSurvey}>
            <Save size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.summaryBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>        
        <Text style={[styles.summaryText, { color: colors.textSecondary }]}>Design • AI Generate • Library</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Survey Basic Info */}
        <View style={styles.basicInfo}>          
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Survey Information</Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Survey Title</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card || colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="Enter survey title..."
                value={surveyTitle}
                onChangeText={setSurveyTitle}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { backgroundColor: colors.card || colors.surface, borderColor: colors.border, color: colors.text }]}
                placeholder="Enter survey description..."
                value={surveyDescription}
                onChangeText={setSurveyDescription}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                { backgroundColor: colors.surface, borderColor: colors.border },
                activeTab === tab.id && { backgroundColor: colors.primary + '18', borderColor: colors.primary },
              ]}
              onPress={() => setActiveTab(tab.id as any)}
              activeOpacity={0.85}
            >
              <View style={[styles.tabIconCircle, { backgroundColor: (activeTab === tab.id ? colors.primary : colors.textSecondary) + '22' }]}>                
                <tab.icon
                  size={22}
                  color={activeTab === tab.id ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[
                  styles.tabText,
                  { color: colors.text },
                  activeTab === tab.id && { color: colors.primary },
                ]}>{tab.title}</Text>
                <Text style={[styles.tabSub, { color: colors.textSecondary }]} numberOfLines={1}>
                  {tab.id === 'builder' && 'Manual building'}
                  {tab.id === 'ai' && 'AI assisted'}
                  {tab.id === 'library' && 'Official bank'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'builder' && <SurveyBuilder />}
          {activeTab === 'ai' && <AIPromptInput />}
          {activeTab === 'library' && <QuestionLibrary />}
        </View>
        <SurveyExportModal
          visible={exportVisible}
          onClose={() => setExportVisible(false)}
          title={surveyTitle}
          description={surveyDescription}
        />
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
  headerKicker: { fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  headerTitle: { fontSize: 26, fontWeight: '700', marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  saveButton: {
    borderWidth: 0,
  },
  basicInfo: { paddingHorizontal: 20, marginBottom: 8 },
  infoCard: { borderWidth: 1, borderRadius: 20, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 18 },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' },
  textInput: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 24, gap: 14 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 18, borderWidth: 1, gap: 14, minHeight: 90 },
  tabIconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 4 },
  tabText: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  tabSub: { fontSize: 11, fontWeight: '500', opacity: 0.75 },
  tabContent: { paddingHorizontal: 20, paddingBottom: 60 },
  summaryBar: { marginHorizontal: 20, borderWidth: 1, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 10, marginBottom: 18 },
  summaryText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
});