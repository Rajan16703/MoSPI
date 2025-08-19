import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Wand as Wand2, Library, Save, Eye, Settings2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SurveyBuilder } from '@/components/SurveyBuilder';
import { QuestionLibrary } from '@/components/QuestionLibrary';
import { AIPromptInput } from '@/components/AIPromptInput';

export default function CreateScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'builder' | 'ai' | 'library'>('builder');
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Survey</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={handlePreviewSurvey}>
            <Eye size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSaveSurvey}>
            <Save size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Survey Basic Info */}
        <View style={styles.basicInfo}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Survey Information</Text>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Survey Title</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter survey title..."
              value={surveyTitle}
              onChangeText={setSurveyTitle}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter survey description..."
              value={surveyDescription}
              onChangeText={setSurveyDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.textSecondary}
            />
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
                activeTab === tab.id && styles.activeTab,
                activeTab === tab.id && { backgroundColor: colors.primary + '15', borderColor: colors.primary },
              ]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <tab.icon 
                size={20} 
                color={activeTab === tab.id ? colors.primary : colors.textSecondary} 
              />
              <Text style={[
                styles.tabText,
                { color: colors.textSecondary },
                activeTab === tab.id && { color: colors.primary },
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'builder' && <SurveyBuilder />}
          {activeTab === 'ai' && <AIPromptInput />}
          {activeTab === 'library' && <QuestionLibrary />}
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
  saveButton: {
    borderWidth: 0,
  },
  basicInfo: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
});