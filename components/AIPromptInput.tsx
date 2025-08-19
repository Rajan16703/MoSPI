import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Wand as Wand2, Sparkles, FileText, Users } from 'lucide-react-native';

export function AIPromptInput() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    {
      title: 'Household Income Survey',
      description: 'Income, employment, and financial status',
      prompt: 'Create a household income survey for urban families in India, including questions about monthly income, employment status, family size, and expenses.',
      icon: Users,
    },
    {
      title: 'Agricultural Census',
      description: 'Land use, crops, and farming practices',
      prompt: 'Generate an agricultural survey for farmers covering land ownership, crop types, irrigation methods, and farming challenges.',
      icon: FileText,
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt to generate the survey.');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      Alert.alert('Success', 'Survey generated successfully! Check the Builder tab to see the questions.');
      setPrompt('');
    }, 2000);
  };

  const useTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sparkles size={24} color="#7c3aed" />
        <Text style={styles.title}>AI Survey Generator</Text>
      </View>
      
      <Text style={styles.description}>
        Describe your survey requirements in natural language, and our AI will create relevant questions for you.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Survey Description</Text>
        <TextInput
          style={styles.promptInput}
          placeholder="E.g., Create a survey about urban transportation habits including public transport usage, vehicle ownership, and daily commute patterns..."
          value={prompt}
          onChangeText={setPrompt}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <TouchableOpacity
        style={[styles.generateButton, isGenerating && styles.generatingButton]}
        onPress={handleGenerate}
        disabled={isGenerating}
      >
        <Wand2 size={20} color="#ffffff" />
        <Text style={styles.generateButtonText}>
          {isGenerating ? 'Generating...' : 'Generate Survey'}
        </Text>
      </TouchableOpacity>

      <View style={styles.templates}>
        <Text style={styles.templatesTitle}>Quick Templates</Text>
        {templates.map((template, index) => (
          <TouchableOpacity
            key={index}
            style={styles.template}
            onPress={() => useTemplate(template.prompt)}
          >
            <View style={styles.templateIcon}>
              <template.icon size={20} color="#1e40af" />
            </View>
            <View style={styles.templateContent}>
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateDescription}>{template.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  promptInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f2937',
    height: 120,
    textAlignVertical: 'top',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  generatingButton: {
    backgroundColor: '#9ca3af',
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  templates: {
    marginTop: 8,
  },
  templatesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  template: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    gap: 12,
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateContent: {
    flex: 1,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});