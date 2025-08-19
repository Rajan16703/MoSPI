import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Plus, GripVertical, Trash2, Type, List, SquareCheck as CheckSquare, Radio } from 'lucide-react-native';
import { DragDropQuestion } from '@/components/DragDropQuestion';

interface Question {
  id: string;
  type: 'text' | 'multiple_choice' | 'checkbox' | 'radio';
  title: string;
  options?: string[];
  required: boolean;
}

export function SurveyBuilder() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'text',
      title: 'What is your household income range?',
      required: true,
    },
    {
      id: '2',
      type: 'radio',
      title: 'What is your employment status?',
      options: ['Employed', 'Unemployed', 'Self-employed', 'Retired'],
      required: true,
    },
  ]);

  const questionTypes = [
    { type: 'text', title: 'Text Input', icon: Type },
    { type: 'radio', title: 'Single Choice', icon: Radio },
    { type: 'checkbox', title: 'Multiple Choice', icon: CheckSquare },
    { type: 'multiple_choice', title: 'Dropdown', icon: List },
  ];

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: `New ${type} question`,
      required: false,
      ...(type !== 'text' && { options: ['Option 1', 'Option 2'] }),
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (id: string) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setQuestions(questions.filter(q => q.id !== id))
        },
      ]
    );
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
            onPress={() => addQuestion(type.type as Question['type'])}
          >
            <type.icon size={20} color="#1e40af" />
            <Text style={styles.questionTypeText}>{type.title}</Text>
            <Plus size={16} color="#6b7280" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Questions List */}
      <Text style={styles.sectionTitle}>Questions ({questions.length})</Text>
      <View style={styles.questionsList}>
        {questions.map((question, index) => (
          <DragDropQuestion
            key={question.id}
            question={question}
            index={index}
            onDelete={() => deleteQuestion(question.id)}
          />
        ))}
        
        {questions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No questions added yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start by adding questions from the types above
            </Text>
          </View>
        )}
      </View>
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
  questionTypes: {
    marginBottom: 32,
  },
  questionType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    gap: 12,
  },
  questionTypeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  questionsList: {
    gap: 12,
  },
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
});