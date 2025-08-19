import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react-native';

export function ThemeToggle() {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={toggleTheme}
    >
      {isDark ? (
        <Sun size={20} color={colors.text} />
      ) : (
        <Moon size={20} color={colors.text} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});