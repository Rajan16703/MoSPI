import { View, Text, StyleSheet } from 'react-native';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  progress: number;
}

export function ProgressIndicator({ current, total, progress }: ProgressIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.progressText}>Question {current} of {total}</Text>
        <Text style={styles.percentageText}>{Math.round(progress * 100)}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1e40af',
    borderRadius: 3,
  },
});