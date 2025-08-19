import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GripVertical, Trash2, CreditCard as Edit, ToggleLeft } from 'lucide-react-native';

interface Question {
  id: string;
  type: 'text' | 'multiple_choice' | 'checkbox' | 'radio';
  title: string;
  options?: string[];
  required: boolean;
}

interface DragDropQuestionProps {
  question: Question;
  index: number;
  onDelete: () => void;
}

export function DragDropQuestion({ question, index, onDelete }: DragDropQuestionProps) {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return 'Text Input';
      case 'radio': return 'Single Choice';
      case 'checkbox': return 'Multiple Choice';
      case 'multiple_choice': return 'Dropdown';
      default: return type;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dragHandle}>
          <GripVertical size={20} color="#9ca3af" />
        </View>
        <View style={styles.questionInfo}>
          <Text style={styles.questionTitle}>{question.title}</Text>
          <Text style={styles.questionType}>{getQuestionTypeLabel(question.type)}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Edit size={16} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Trash2 size={16} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.options}>
        <View style={styles.option}>
          <ToggleLeft size={16} color={question.required ? '#059669' : '#9ca3af'} />
          <Text style={styles.optionText}>Required</Text>
        </View>
        {question.options && (
          <Text style={styles.optionText}>
            {question.options.length} options
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dragHandle: {
    marginRight: 12,
  },
  questionInfo: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  questionType: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionText: {
    fontSize: 14,
    color: '#6b7280',
  },
});