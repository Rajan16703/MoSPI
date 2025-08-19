import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: typeof LucideIcon;
  color: string;
}

export function QuickActionCard({ title, subtitle, icon: Icon, color }: QuickActionCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={[styles.card, { width: '48%', backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Icon size={24} color={color} style={styles.icon} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
});