import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Globe, Shield, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { ConsentForm } from '@/components/ConsentForm';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SurveyQuestion } from '@/components/SurveyQuestion';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { useMospiSurveys } from '@/hooks/useMospiSurveys';
import { useSurvey } from '@/contexts/SurveyContext';
import { useParadata } from '@/contexts/ParadataContext';
import { useResponses } from '@/contexts/ResponseContext';
import { useAdaptiveEvents } from '@/contexts/AdaptiveEventsContext';
import { Linking } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function SurveyScreen() {
  const [currentStep, setCurrentStep] = useState<'consent' | 'language' | 'survey' | 'complete'>('consent');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const { data: surveyMeta } = useMospiSurveys();
  const { questions: builderQuestions } = useSurvey();
  const { startSurvey: startParadata, completeSurvey: completeParadata, startQuestion: startPQ, endQuestion: endPQ } = useParadata();
  const { recordResponse } = useResponses();
  const { requestFollowUp } = useAdaptiveEvents();
  const surveyQuestions = useMemo(() => {
    // Prefer AI/builder questions if available, else fallback to awareness questions
    if (builderQuestions.length) {
      return builderQuestions.map(q => ({
        id: q.id,
        type: q.type,
        title: q.title,
        options: q.options,
        required: q.required
      }));
    }
    if (!surveyMeta.length) return [] as any[];
    return surveyMeta.slice(0, 5).map(m => ({
      id: m.id,
      type: 'multiple_choice' as const,
      title: `Are you aware of the ${m.title}?`,
      hiTitle: `${m.title} के बारे में क्या आप जानते हैं?`,
      options: ['Yes', 'No', 'Not sure'],
      required: false
    }));
  }, [builderQuestions, surveyMeta]);

  const handleConsentComplete = () => {
    setCurrentStep('language');
  };

  const handleLanguageSelected = (language: string) => {
    setSelectedLanguage(language);
    setCurrentStep('survey');
    startParadata(language);
    // start first question timing next tick
    setTimeout(() => {
      const q = surveyQuestions[0]; if (q) startPQ(q.id);
    }, 0);
  };

  const handleQuestionResponse = (questionId: string, response: any) => {
    setResponses(prev => ({ ...prev, [questionId]: response }));
  endPQ(questionId, response);
  const q = surveyQuestions.find(q => q.id === questionId);
  if (q) recordResponse(questionId, q.title, response);
  };

  const handleNext = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
  // start timing for next question
  const next = surveyQuestions[currentQuestion + 1];
  if (next) startPQ(next.id);
    } else {
      setCurrentStep('complete');
  completeParadata();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const progress = currentStep === 'survey' && surveyQuestions.length > 0 ? (currentQuestion + 1) / surveyQuestions.length : 0;
  const { colors, isDark } = useTheme();
  const maxWidth = 900; const horizontalPad = 24; const screenWidth = Dimensions.get('window').width;
  const centerStyle = { alignItems: 'center' as const };
  const cardWidthStyle = { width: Math.min(screenWidth - horizontalPad * 2, maxWidth) };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, centerStyle]}>
        <View style={[cardWidthStyle]}> 
        <Text style={[styles.headerTitle, { color: colors.text }]}>MoSPI Survey</Text>
        <View style={styles.headerInfo}>
          <View style={styles.infoItem}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText,{color: colors.textSecondary}]}>~5 min</Text>
          </View>
          <View style={styles.infoItem}>
            <Globe size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText,{color: colors.textSecondary}]}>{selectedLanguage || 'Multi-lingual'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Shield size={16} color={colors.success} />
            <Text style={[styles.infoText,{color: colors.textSecondary}]}>Secure</Text>
          </View>
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
      <ScrollView style={[styles.content]} showsVerticalScrollIndicator={false} contentContainerStyle={[centerStyle,{ paddingBottom: 80 }]}>
        {currentStep === 'consent' && (
          <View style={cardWidthStyle}><ConsentForm onComplete={handleConsentComplete} /></View>
        )}
        
        {currentStep === 'language' && (
          <View style={[{ gap: 24 }, cardWidthStyle]}>
            <LanguageSelector onSelect={handleLanguageSelected} />
            <View style={[styles.externalLinksBox,{ backgroundColor: isDark? colors.card : '#f1f5f9', borderColor: colors.border }]}>
              <Text style={[styles.linksTitle,{color: colors.text}]}>Official Survey Portals</Text>
              {[
                { label: 'MoSPI Current Surveys', url: 'https://mospi.gov.in/current-surveys-0' },
                { label: 'NSSO (National Sample Surveys)', url: 'https://mospi.gov.in' },
                { label: 'MoSPI Download Reports', url: 'https://mospi.gov.in/download-reports' },
                { label: 'India Data Portal', url: 'https://data.gov.in' },
              ].map(link => (
                <TouchableOpacity key={link.url} onPress={() => Linking.openURL(link.url)} style={styles.linkItem}>
                  <Text style={[styles.linkText,{ color: colors.primary }]}>{link.label}</Text>
                  <ArrowRight size={14} color={colors.primary} />
                </TouchableOpacity>
              ))}
              <Text style={[styles.linksHint,{color: colors.textSecondary}]}>Tap a link to view official survey details in your browser.</Text>
            </View>
          </View>
        )}
        
  {currentStep === 'survey' && surveyQuestions.length > 0 && (
          <View style={[styles.surveyContent, cardWidthStyle]}>
            <SurveyQuestion
              question={surveyQuestions[currentQuestion]}
              response={responses[surveyQuestions[currentQuestion].id]}
              onResponse={(response) => handleQuestionResponse(surveyQuestions[currentQuestion].id, response)}
              language={selectedLanguage}
            />
            
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[styles.navButton, styles.prevButton]}
                onPress={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <Text style={[styles.navButtonText, { color: colors.text }, currentQuestion === 0 && styles.disabledText]}>
                  Previous
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.navButton, styles.nextButton]}
                onPress={handleNext}
              >
                <Text style={[styles.nextButtonText,{ color: '#000' }]}> {/* invert on black */}
                  {currentQuestion === surveyQuestions.length - 1 ? 'Finish' : 'Next'}
                </Text>
                <ArrowRight size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
              {/* Follow-up suggestion button */}
          <TouchableOpacity
                style={styles.followUpBtn}
                onPress={() => {
                  // Navigate user to create tab with a prefilled adaptive follow-up prompt idea
                  // For now we mutate a global (window) or use Alert with suggestion
                  const q = surveyQuestions[currentQuestion];
                  const ans = responses[q.id];
                  const suggestion = `Generate a follow-up question exploring ${q.title} given the answer: ${Array.isArray(ans)? ans.join(', '): ans}`;
            requestFollowUp(suggestion);
                }}
              >
                <Text style={styles.followUpText}>Generate follow-up</Text>
              </TouchableOpacity>
          </View>
        )}
        {currentStep === 'survey' && surveyQuestions.length === 0 && (
          <View style={{ paddingVertical: 40 }}>
            <Text style={{ textAlign: 'center', color: colors.textSecondary }}>Loading MoSPI survey-derived questions...</Text>
          </View>
        )}
        
        {currentStep === 'complete' && (
          <View style={[styles.completeScreen, cardWidthStyle]}>
            <CheckCircle size={64} color={colors.success} />
            <Text style={[styles.completeTitle,{color: colors.text}]}>Survey Completed!</Text>
            <Text style={[styles.completeMessage,{color: colors.textSecondary}]}>
              Thank you for participating in this survey. Your responses have been recorded securely 
              and will help improve government services and policy making.
            </Text>
            <TouchableOpacity 
              style={[styles.completeButton,{ backgroundColor: colors.primary }]}
              onPress={() => {
                setCurrentStep('consent');
                setCurrentQuestion(0);
                setResponses({});
                setSelectedLanguage('');
              }}
            >
              <Text style={[styles.completeButtonText,{ color: colors.background }]}>Take Another Survey</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 32, fontWeight: '700', marginBottom: 12, letterSpacing: 0.5 },
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
  content: { flex: 1, paddingHorizontal: 20 },
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
  nextButton: { backgroundColor: '#ffffff', flexDirection: 'row', gap: 8, borderWidth: 1, borderColor: '#333', },
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
  completeTitle: { fontSize: 28, fontWeight: '700', marginTop: 24, marginBottom: 16 },
  completeMessage: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  completeButton: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12 },
  completeButtonText: { fontSize: 16, fontWeight: '600' },
  externalLinksBox: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 12 },
  linksTitle: { fontSize: 14, fontWeight: '700' },
  linkItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  linkText: { fontSize: 13, fontWeight: '600' },
  linksHint: { fontSize: 11, marginTop: 4 },
  followUpBtn: {
    marginTop: 12,
    alignSelf: 'flex-end',
    backgroundColor: '#eef2ff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  followUpText: { fontSize: 12, fontWeight: '600', color: '#1e40af' },
});