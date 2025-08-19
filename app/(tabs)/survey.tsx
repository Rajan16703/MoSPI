import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Globe, Shield, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { ConsentForm } from '@/components/ConsentForm';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SurveyQuestion } from '@/components/SurveyQuestion';
import { ProgressIndicator } from '@/components/ProgressIndicator';

export default function SurveyScreen() {
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MoSPI Survey</Text>
        <View style={styles.headerInfo}>
          <View style={styles.infoItem}>
            <Clock size={16} color="#6b7280" />
            <Text style={styles.infoText}>~5 min</Text>
          </View>
          <View style={styles.infoItem}>
            <Globe size={16} color="#6b7280" />
            <Text style={styles.infoText}>{selectedLanguage || 'Multi-lingual'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Shield size={16} color="#059669" />
            <Text style={styles.infoText}>Secure</Text>
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
                onPress={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <Text style={[styles.navButtonText, currentQuestion === 0 && styles.disabledText]}>
                  Previous
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
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
            <CheckCircle size={64} color="#059669" />
            <Text style={styles.completeTitle}>Survey Completed!</Text>
            <Text style={styles.completeMessage}>
              Thank you for participating in this survey. Your responses have been recorded securely 
              and will help improve government services and policy making.
            </Text>
            <TouchableOpacity 
              style={styles.completeButton}
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
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
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
    color: '#6b7280',
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nextButton: {
    backgroundColor: '#1e40af',
    flexDirection: 'row',
    gap: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  disabledText: {
    color: '#9ca3af',
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
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 16,
  },
  completeMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  completeButton: {
    backgroundColor: '#1e40af',
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