import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Wand as Wand2, Library, Save, Eye, Settings2 } from 'lucide-react-native';
import { SurveyBuilder } from '@/components/SurveyBuilder';
import { QuestionLibrary } from '@/components/QuestionLibrary';
import { AIPromptInput } from '@/components/AIPromptInput';

export default function CreateScreen() {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Survey</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handlePreviewSurvey}>
            <Eye size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.saveButton]} onPress={handleSaveSurvey}>
            <Save size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Survey Basic Info */}
        <View style={styles.basicInfo}>
          <Text style={styles.sectionTitle}>Survey Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Survey Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter survey title..."
              value={surveyTitle}
              onChangeText={setSurveyTitle}
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Enter survey description..."
              value={surveyDescription}
              onChangeText={setSurveyDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9ca3af"
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
                activeTab === tab.id && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <tab.icon 
                size={20} 
                color={activeTab === tab.id ? '#1e40af' : '#6b7280'} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
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
  saveButton: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  basicInfo: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#eff6ff',
    borderColor: '#1e40af',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#1e40af',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
});