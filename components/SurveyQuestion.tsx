import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useParadata } from '@/contexts/ParadataContext';
import { usePrepopulation } from '@/contexts/PrepopulationContext';

interface Question {
  id: string;
  type: 'text' | 'radio' | 'multiple_choice' | 'checkbox';
  title: string;
  options?: string[];
  required: boolean;
  hiTitle?: string; // optional Hindi localized title
}

interface SurveyQuestionProps {
  question: Question;
  response: any;
  onResponse: (response: any) => void;
  language?: string; // e.g., 'hi'
}

export function SurveyQuestion({ question, response, onResponse, language }: SurveyQuestionProps) {
  const [validationError, setValidationError] = useState('');
  const { summary } = useParadata();
  const record = summary.records.find(r => r.questionId === question.id);
  const fast = record && record.durationMs !== undefined && record.durationMs < 1500;
  const { values: prepopValues } = usePrepopulation();
  const prepop = prepopValues[question.id];

  const isHindi = language === 'hi' || language?.toLowerCase() === 'hindi';
  const t = (en: string, hi: string) => (isHindi ? hi : en);

  const handleTextResponse = (text: string) => {
    onResponse(text);
    if (validationError) setValidationError('');
  };

  const handleRadioResponse = (option: string) => {
    onResponse(option);
    if (validationError) setValidationError('');
  };

  const toggleCheckbox = (option: string) => {
    const current: string[] = Array.isArray(response) ? response : [];
    let next: string[];
    if (current.includes(option)) {
      next = current.filter(o => o !== option);
    } else {
      next = [...current, option];
    }
    onResponse(next);
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
  <Text style={styles.questionTitle}>{isHindi && question.hiTitle ? question.hiTitle : question.title}</Text>
        {question.required && (
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>{t('Required', 'अनिवार्य')}</Text>
          </View>
        )}
      </View>
      {prepop && (
        <View style={styles.prepopBanner}>
          <Text style={styles.prepopText}>
            {t('Pre-filled', 'पूर्व भरा हुआ')}{prepop.source ? `: ${prepop.source}` : ''}{prepop.locked ? t(' (locked)', ' (लॉक)') : t(' (editable)', ' (संपादन योग्य)')}
          </Text>
        </View>
      )}

  {question.type === 'text' && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={[styles.textInput, validationError && styles.errorInput]}
            placeholder={t('Enter your response...', 'अपना उत्तर लिखें...')}
            value={response || ''}
            onChangeText={handleTextResponse}
            onBlur={validateResponse}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#9ca3af"
    editable={!prepop?.locked}
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

      {question.type === 'multiple_choice' && question.options && (
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const selected = response === option; // single choice dropdown-like
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.radioOption,
                  selected && styles.selectedOption,
                ]}
                onPress={() => handleRadioResponse(option)}
              >
                <View style={[
                  styles.radioButton,
                  selected && styles.selectedRadio,
                ]}>
                  {selected && <CheckCircle size={16} color="#ffffff" />}
                </View>
                <Text style={[
                  styles.optionText,
                  selected && styles.selectedOptionText,
                ]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {question.type === 'checkbox' && question.options && (
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const arr: string[] = Array.isArray(response) ? response : [];
            const selected = arr.includes(option);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.radioOption,
                  selected && styles.selectedOption,
                ]}
                onPress={() => toggleCheckbox(option)}
              >
                <View style={[
                  styles.checkboxBox,
                  selected && styles.checkboxBoxSelected,
                ]}>
                  {selected && <CheckCircle size={16} color="#ffffff" />}
                </View>
                <Text style={[
                  styles.optionText,
                  selected && styles.selectedOptionText,
                ]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Validation Error */}
      {validationError && (
        <View style={styles.errorContainer}>
          <AlertCircle size={16} color="#dc2626" />
          <Text style={styles.errorText}>{validationError}</Text>
        </View>
      )}
      {!validationError && fast && (
        <View style={styles.warningContainer}>
          <AlertCircle size={16} color="#d97706" />
          <Text style={styles.warningText}>{t('Answered very quickly – please ensure accuracy.', 'बहुत जल्दी उत्तर दिया गया – कृपया उत्तर की जाँच करें।')}</Text>
        </View>
      )}

      {/* AI Insight (Simulated) */}
  {response && (question.type === 'radio' || question.type === 'multiple_choice') && (
        <View style={styles.aiInsight}>
          <Text style={styles.aiInsightText}>
    {t('💡 Based on your selection, we might ask follow-up questions about related topics.', '💡 आपके उत्तर के आधार पर हम सम्बंधित विषयों पर आगे के प्रश्न पूछ सकते हैं।')}
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
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxSelected: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
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
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fcd34d',
    padding: 8,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#92400e',
    flex: 1,
  },
  prepopBanner: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    marginTop: -12,
    marginBottom: 16,
  },
  prepopText: {
    fontSize: 12,
    color: '#3730a3',
    fontWeight: '500',
  },
});