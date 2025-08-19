import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

interface Question {
  id: string;
  type: 'text' | 'radio';
  title: string;
  options?: string[];
  required: boolean;
}

interface SurveyQuestionProps {
  question: Question;
  response: any;
  onResponse: (response: any) => void;
}

export function SurveyQuestion({ question, response, onResponse }: SurveyQuestionProps) {
  const [validationError, setValidationError] = useState('');

  const handleTextResponse = (text: string) => {
    onResponse(text);
    if (validationError) setValidationError('');
  };

  const handleRadioResponse = (option: string) => {
    onResponse(option);
    if (validationError) setValidationError('');
  };

  const validateResponse = () => {
    if (question.required && (!response || response.trim() === '')) {
      setValidationError('This field is required');
      return false;
    }
    setValidationError('');
    return true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionTitle}>{question.title}</Text>
        {question.required && (
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>Required</Text>
          </View>
        )}
      </View>

      {question.type === 'text' && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={[styles.textInput, validationError && styles.errorInput]}
            placeholder="Enter your response..."
            value={response || ''}
            onChangeText={handleTextResponse}
            onBlur={validateResponse}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#9ca3af"
          />
        </View>
      )}

      {question.type === 'radio' && question.options && (
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.radioOption,
                response === option && styles.selectedOption,
              ]}
              onPress={() => handleRadioResponse(option)}
            >
              <View style={[
                styles.radioButton,
                response === option && styles.selectedRadio,
              ]}>
                {response === option && (
                  <CheckCircle size={16} color="#ffffff" />
                )}
              </View>
              <Text style={[
                styles.optionText,
                response === option && styles.selectedOptionText,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Validation Error */}
      {validationError && (
        <View style={styles.errorContainer}>
          <AlertCircle size={16} color="#dc2626" />
          <Text style={styles.errorText}>{validationError}</Text>
        </View>
      )}

      {/* AI Insight (Simulated) */}
      {response && question.type === 'radio' && (
        <View style={styles.aiInsight}>
          <Text style={styles.aiInsightText}>
            💡 Based on your selection, we might ask follow-up questions about related topics.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: 28,
    flex: 1,
    marginRight: 12,
  },
  requiredBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  requiredText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
  },
  textInputContainer: {
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f2937',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  selectedOption: {
    backgroundColor: '#eff6ff',
    borderColor: '#1e40af',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  selectedOptionText: {
    color: '#1e40af',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  aiInsight: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  aiInsightText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
});