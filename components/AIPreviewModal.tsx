import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSurvey } from '@/contexts/SurveyContext';

interface PreviewModalProps {
  visible: boolean;
  onClose: () => void;
  draft: any[];
  onCommit: (selected: any[]) => void;
}

export const AIPreviewModal: React.FC<PreviewModalProps> = ({ visible, onClose, draft, onCommit }) => {
  const { questions } = useSurvey();
  const [selected, setSelected] = useState<Set<number>>(new Set(draft.map((_, i) => i)));

  const toggle = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>AI Generated Questions</Text>
        <Text style={styles.subtitle}>Tap to include/exclude. Existing: {questions.length}</Text>
        <ScrollView style={styles.list}>
          {draft.map((q, i) => {
            const active = selected.has(i);
            return (
              <TouchableOpacity key={i} onPress={() => toggle(i)} style={[styles.item, !active && styles.itemDisabled]}>
                <View style={styles.row}>                  
                  <Text style={[styles.itemTitle, !active && styles.dim]}>{q.title}</Text>
                  <Text style={[styles.badge, !active && styles.badgeOff]}>{q.type}</Text>
                </View>
                {q.options && <Text style={styles.options}>{q.options.slice(0,6).join(', ')}</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.secondary]}><Text style={styles.buttonTextSecondary}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onCommit(draft.filter((_, i) => selected.has(i)))} style={[styles.button, styles.primary]}><Text style={styles.buttonText}>Add {selected.size}</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0d1117' },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#94a3b8', marginBottom: 16 },
  list: { flex: 1 },
  item: { padding: 14, borderRadius: 14, backgroundColor: '#161b22', marginBottom: 10, borderWidth: 1, borderColor: '#1f2428' },
  itemDisabled: { opacity: 0.4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemTitle: { fontSize: 14, fontWeight: '600', color: '#f1f5f9', marginBottom: 4 },
  dim: { color: '#64748b' },
  badge: { textTransform: 'uppercase', fontSize: 10, fontWeight: '700', backgroundColor: '#1d4ed8', color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeOff: { backgroundColor: '#475569' },
  options: { fontSize: 11, color: '#94a3b8' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  secondary: { backgroundColor: '#1f2428' },
  primary: { backgroundColor: '#6366f1' },
  buttonText: { color: '#fff', fontWeight: '700' },
  buttonTextSecondary: { color: '#e2e8f0', fontWeight: '600' }
});
