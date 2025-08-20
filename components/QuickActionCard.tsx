import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
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
    <TouchableOpacity activeOpacity={0.85} style={[styles.card, { width: '48%', backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconCircle, { backgroundColor: color + '22' }]}>        
        <Icon size={28} color={color} />
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'flex-start',
    minHeight: 150,
  },
  iconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.85,
  },
});