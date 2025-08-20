import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Plus, GripVertical, Trash2, Type, List, SquareCheck as CheckSquare, Radio } from 'lucide-react-native';
import { DragDropQuestion } from '@/components/DragDropQuestion';
import { useSurvey } from '@/contexts/SurveyContext';

interface Question {
  id: string;
  type: 'text' | 'multiple_choice' | 'checkbox' | 'radio';
  title: string;
  options?: string[];
  required: boolean;
  source?: string;
}

export function SurveyBuilder() {
  const { questions, addQuestions, removeQuestion, recentlyAdded, clearRecentlyAdded } = useSurvey();
  const [toast, setToast] = useState<string | null>(null);
  const listRef = (global as any)._surveyListRef || { current: null };
  if (!(global as any)._surveyListRef) (global as any)._surveyListRef = listRef;
  useEffect(() => {
    if (recentlyAdded.size) {
      const t = setTimeout(() => clearRecentlyAdded(), 2500);
      // Scroll to end when new questions added
      requestAnimationFrame(() => {
        (listRef.current as any)?.scrollToEnd?.({ animated: true });
      });
      return () => clearTimeout(t);
    }
  }, [recentlyAdded, clearRecentlyAdded]);
  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const questionTypes = [
    { type: 'text', title: 'Text Input', icon: Type },
    { type: 'radio', title: 'Single Choice', icon: Radio },
    { type: 'checkbox', title: 'Multiple Choice', icon: CheckSquare },
    { type: 'multiple_choice', title: 'Dropdown', icon: List },
  ];

  const append = (type: Question['type']) => {
    const base = {
      type,
      title: `New ${type} question`,
      required: false,
      ...(type !== 'text' && { options: ['Option 1', 'Option 2'] })
    } as any;
    const res = addQuestions([base]);
    if (res.added) setToast('Question added');
    else setToast('Duplicate skipped');
  };

  const deleteQuestion = (id: string) => {
    removeQuestion(id);
    setToast('Question deleted');
  };

  return (
    <View style={styles.container}>
      {/* Question Types */}
      <Text style={styles.sectionTitle}>Add Question</Text>
      <View style={styles.questionTypes}>
        {questionTypes.map((type) => (
          <TouchableOpacity
            key={type.type}
            style={styles.questionType}
            onPress={() => append(type.type as Question['type'])}
          >
            <View style={styles.iconCircle}><type.icon size={22} color="#1e40af" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.questionTypeText}>{type.title}</Text>
              <Text style={styles.questionTypeSub}>Tap to insert</Text>
            </View>
            <View style={styles.addCircle}><Plus size={16} color="#1e40af" /></View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Questions List */}
      <Text style={styles.sectionTitle}>Questions ({questions.length})</Text>
  <ScrollView ref={r => { listRef.current = r; }} style={{ maxHeight: 600 }} contentContainerStyle={styles.questionsList}>
        {questions.map((question, index) => (
          <View key={question.id} style={recentlyAdded.has(question.id) ? styles.flashWrap : undefined}>
            <DragDropQuestion
              question={question}
              index={index}
              onDelete={() => deleteQuestion(question.id)}
            />
          </View>
        ))}
        
        {questions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No questions added yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start by adding questions from the types above
            </Text>
          </View>
        )}
      </ScrollView>
      {toast && (
        <View style={styles.inlineToast} pointerEvents="none">
          <Text style={styles.inlineToastText}>{toast}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  questionTypes: { marginBottom: 28, gap: 10 },
  questionType: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', gap: 16 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  addCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  questionTypeText: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  questionTypeSub: { fontSize: 11, fontWeight: '500', color: '#6b7280', marginTop: 2, letterSpacing: 0.5 },
  questionsList: { gap: 14 },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  flashWrap: { shadowColor: '#6366f1', shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } },
  inlineToast: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#111827', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937' },
  inlineToastText: { color: '#f1f5f9', fontSize: 12, fontWeight: '600' },
});