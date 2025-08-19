import { View, Text, StyleSheet } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';

interface StatusCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export function StatusCard({ title, value, icon: Icon, color }: StatusCardProps) {
  return (
    <View style={[styles.card, { width: '48%' }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Icon size={20} color={color} />
        </View>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});