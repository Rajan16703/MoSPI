import React, { useMemo } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { X, Copy, Download } from 'lucide-react-native';
import { useSurvey } from '@/contexts/SurveyContext';
import { useParadata } from '@/contexts/ParadataContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export const SurveyExportModal: React.FC<Props> = ({ visible, onClose, title, description }) => {
  const { questions } = useSurvey();
  const { summary: paradata } = useParadata();

  const payload = useMemo(() => {
    return {
      version: 1,
      id: 'survey_' + Date.now(),
      title: title || 'Untitled Survey',
      description: description || '',
      createdAt: new Date().toISOString(),
      questionCount: questions.length,
      questions: questions.map(q => ({
        id: q.id,
        type: q.type,
        title: q.title,
        required: q.required,
        options: q.options || undefined,
        source: q.source || undefined,
      })),
      paradata: paradata && paradata.records.length ? {
        startedAt: paradata.startedAt,
        completedAt: paradata.completedAt,
        totalDurationMs: paradata.totalDurationMs,
        quality: paradata.quality,
        devicePlatform: paradata.devicePlatform,
  consentAt: paradata.consentAt,
  consentHash: paradata.consentHash,
        records: paradata.records.map(r => ({
          questionId: r.questionId,
          durationMs: r.durationMs,
          flags: r.flags,
        }))
      } : undefined
    };
  }, [questions, title, description, paradata]);

  const json = useMemo(() => JSON.stringify(payload, null, 2), [payload]);

  const copy = async () => {
    let success = false;
    try {
      // Prefer expo-clipboard if installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Clipboard = require('expo-clipboard');
      if (Clipboard?.setStringAsync) { await Clipboard.setStringAsync(json); success = true; }
    } catch {}
    if (!success && typeof navigator !== 'undefined' && (navigator as any).clipboard) {
      try { await (navigator as any).clipboard.writeText(json); success = true; } catch {}
    }
    if (!success) console.log('[Export] Copy not available');
  };

  const download = () => {
    if (typeof document === 'undefined') { console.log('[Export] Download only supported on web'); return; }
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safe = (title || 'survey').toLowerCase().replace(/[^a-z0-9-_]+/g, '_');
    a.href = url; a.download = safe + '.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Export Survey</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}><X size={20} color="#e2e8f0" /></TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Questions: {questions.length}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={copy}>
            <Copy size={16} color="#fff" />
            <Text style={styles.actionText}>Copy JSON</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondary]} onPress={download} disabled={Platform.OS !== 'web'}>
            <Download size={16} color={Platform.OS === 'web' ? '#1e293b' : '#64748b'} />
            <Text style={[styles.actionTextAlt, Platform.OS !== 'web' && { color: '#64748b' }]}>Download</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.codeBox}>
          <Text style={styles.code} selectable>{json}</Text>
        </ScrollView>
        <Text style={styles.footerNote}>This JSON can be stored in a DB or re-imported later.</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117', padding: 20, paddingTop: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#f1f5f9' },
  closeBtn: { padding: 8, borderRadius: 8, backgroundColor: '#1f2428' },
  subtitle: { fontSize: 12, color: '#94a3b8', marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  primary: { backgroundColor: '#6366f1' },
  secondary: { backgroundColor: '#e2e8f0' },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  actionTextAlt: { color: '#1e293b', fontWeight: '600', fontSize: 13 },
  codeBox: { flex: 1, backgroundColor: '#161b22', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1f2428' },
  code: { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }), fontSize: 12, color: '#e2e8f0' },
  footerNote: { fontSize: 11, color: '#64748b', marginTop: 12, textAlign: 'center' }
});
