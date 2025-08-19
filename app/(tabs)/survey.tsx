import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Globe, Shield, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ConsentForm } from '@/components/ConsentForm';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SurveyQuestion } from '@/components/SurveyQuestion';
import { ProgressIndicator } from '@/components/ProgressIndicator';

export default function SurveyScreen() {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState<'consent' | 'language' | 'survey' | 'complete'>('consent');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const surveyQuestions = [
    {
      id: 'q1',
      type: 'radio' as const,
      title: 'What is your age group?',
      options: ['18-25', '26-35', '36-45', '46-55', '55+'],
      required: true,
    },
    {
      id: 'q2',
      type: 'radio' as const,
      title: 'What is your monthly household income?',
      options: ['Below ₹25,000', '₹25,000-₹50,000', '₹50,000-₹1,00,000', 'Above ₹1,00,000'],
      required: true,
    },
    {
      id: 'q3',
      type: 'text' as const,
      title: 'What are the main challenges you face in your daily life?',
      required: false,
    },
  ];

  const handleConsentComplete = () => {
    setCurrentStep('language');
  };

  const handleLanguageSelected = (language: string) => {
    setSelectedLanguage(language);
    setCurrentStep('survey');
  };

  const handleQuestionResponse = (questionId: string, response: any) => {
    setResponses(prev => ({ ...prev, [questionId]: response }));
  };

  const handleNext = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setCurrentStep('complete');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const progress = currentStep === 'survey' ? (currentQuestion + 1) / surveyQuestions.length : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>MoSPI Survey</Text>
        <View style={styles.headerInfo}>
          <View style={styles.infoItem}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>~5 min</Text>
          </View>
          <View style={styles.infoItem}>
            <Globe size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>{selectedLanguage || 'Multi-lingual'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Shield size={16} color={colors.success} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Secure</Text>
          </View>
        </View>
      </View>

      {/* Progress */}
      {currentStep === 'survey' && (
        <ProgressIndicator 
          current={currentQuestion + 1} 
          total={surveyQuestions.length} 
          progress={progress} 
        />
      )}

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 'consent' && (
          <ConsentForm onComplete={handleConsentComplete} />
        )}
        
        {currentStep === 'language' && (
          <LanguageSelector onSelect={handleLanguageSelected} />
        )}
        
        {currentStep === 'survey' && (
          <View style={styles.surveyContent}>
            <SurveyQuestion
              question={surveyQuestions[currentQuestion]}
              response={responses[surveyQuestions[currentQuestion].id]}
              onResponse={(response) => handleQuestionResponse(surveyQuestions[currentQuestion].id, response)}
            />
            
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[styles.navButton, styles.prevButton]}
                style={[styles.navButton, styles.prevButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <Text style={[styles.navButtonText, currentQuestion === 0 && styles.disabledText]}>
                <Text style={[styles.navButtonText, { color: colors.text }, currentQuestion === 0 && { color: colors.textSecondary }]}>
                  Previous
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton, { backgroundColor: colors.primary }]}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestion === surveyQuestions.length - 1 ? 'Finish' : 'Next'}
                </Text>
                <ArrowRight size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {currentStep === 'complete' && (
          <View style={styles.completeScreen}>
            <CheckCircle size={64} color={colors.success} />
            <Text style={[styles.completeTitle, { color: colors.text }]}>Survey Completed!</Text>
            <Text style={[styles.completeMessage, { color: colors.textSecondary }]}>
              Thank you for participating in this survey. Your responses have been recorded securely 
              and will help improve government services and policy making.
            </Text>
            <TouchableOpacity 
              style={[styles.completeButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                setCurrentStep('consent');
                setCurrentQuestion(0);
                setResponses({});
                setSelectedLanguage('');
              }}
            >
              <Text style={styles.completeButtonText}>Take Another Survey</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  headerInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  surveyContent: {
    flex: 1,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    borderWidth: 1,
  },
  nextButton: {
    flexDirection: 'row',
    gap: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  completeScreen: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
  },
  completeMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  completeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});