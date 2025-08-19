import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}

export function QuickActionCard({ title, subtitle, icon: Icon, color }: QuickActionCardProps) {
  return (
    <TouchableOpacity style={[styles.card, { width: '48%' }]}>
      <Icon size={24} color={color} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
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
    alignItems: 'flex-start',
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});