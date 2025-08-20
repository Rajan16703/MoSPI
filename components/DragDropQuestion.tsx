import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { GripVertical, Trash2, CreditCard as Edit, ToggleLeft, ToggleRight, Plus, X } from 'lucide-react-native';
import { useSurvey } from '@/contexts/SurveyContext';

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
  const { updateQuestion } = useSurvey();
  const editing = (question as any)._editing;
  const tempTitle = (question as any)._tempTitle ?? question.title;
  const tempOptions: string[] = (question as any)._tempOptions ?? question.options ?? [];
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return 'Text Input';
      case 'radio': return 'Single Choice';
      case 'checkbox': return 'Multiple Choice';
      case 'multiple_choice': return 'Dropdown';
      default: return type;
    }
  };

  const startEdit = () => {
    updateQuestion(question.id, { ...(question as any), _editing: true, _tempTitle: question.title, _tempOptions: question.options });
  };
  const cancelEdit = () => {
    updateQuestion(question.id, { ...(question as any), _editing: false, _tempTitle: undefined, _tempOptions: undefined });
  };
  const commitEdit = () => {
    updateQuestion(question.id, { title: tempTitle, options: tempOptions });
    // Clear meta via cast
    (question as any)._editing = false; (question as any)._tempTitle = undefined; (question as any)._tempOptions = undefined;
  };
  const setTempTitle = (t: string) => updateQuestion(question.id, { ...(question as any), _tempTitle: t });
  const addTempOption = () => updateQuestion(question.id, { ...(question as any), _tempOptions: [...tempOptions, `Option ${tempOptions.length + 1}`] });
  const setTempOption = (i: number, v: string) => {
    const copy = [...tempOptions]; copy[i] = v; updateQuestion(question.id, { ...(question as any), _tempOptions: copy });
  };
  const toggleRequired = () => updateQuestion(question.id, { required: !question.required });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dragHandle}>
          <GripVertical size={20} color="#9ca3af" />
        </View>
        <View style={styles.questionInfo}>
          {editing ? (
            <TextInput value={tempTitle} onChangeText={setTempTitle} style={styles.titleInput} />
          ) : (
            <Text style={styles.questionTitle}>{question.title}</Text>
          )}
          <Text style={styles.questionType}>{getQuestionTypeLabel(question.type)}</Text>
        </View>
        <View style={styles.actions}>
          {!editing && (
            <TouchableOpacity style={styles.actionButton} onPress={startEdit}>
              <Edit size={16} color="#6b7280" />
            </TouchableOpacity>
          )}
          {editing && (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={commitEdit}>
                <ToggleRight size={16} color="#059669" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={cancelEdit}>
                <X size={16} color="#dc2626" />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Trash2 size={16} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.options}>
        <TouchableOpacity style={styles.option} onPress={toggleRequired}>
          {question.required ? <ToggleRight size={16} color="#059669" /> : <ToggleLeft size={16} color="#9ca3af" />}
          <Text style={styles.optionText}>Required</Text>
        </TouchableOpacity>
        {(question.options || editing) && (
          <View style={{ flex: 1 }}>
            {editing ? tempOptions.map((op, i) => (
              <TextInput key={i} value={op} onChangeText={v => setTempOption(i, v)} style={styles.optionInput} />
            )) : (
              <Text style={styles.optionText}>{question.options?.length} options</Text>
            )}
            {editing && (
              <TouchableOpacity onPress={addTempOption} style={styles.addOptionBtn}>
                <Plus size={14} color="#1e40af" />
                <Text style={styles.addOptionText}>Add Option</Text>
              </TouchableOpacity>
            )}
          </View>
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
  titleInput: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4, padding: 0, borderBottomWidth: 1, borderColor: '#e5e7eb' },
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
  optionInput: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, fontSize: 12, marginBottom: 6 },
  addOptionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  addOptionText: { fontSize: 12, fontWeight: '600', color: '#1e40af' },
});