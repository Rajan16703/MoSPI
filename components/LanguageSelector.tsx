import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Globe, CircleCheck as CheckCircle } from 'lucide-react-native';

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
}

export function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Globe size={48} color="#1e40af" />
        <Text style={styles.title}>Choose Your Language</Text>
        <Text style={styles.subtitle}>
          Select your preferred language for taking the survey. The entire survey will be translated automatically.
        </Text>
      </View>

      <View style={styles.languageGrid}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={styles.languageCard}
            onPress={() => onSelect(language.native)}
          >
            <Text style={styles.nativeText}>{language.native}</Text>
            <Text style={styles.englishText}>{language.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't see your language? The survey will be available in your language soon.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  languageCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  nativeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  englishText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});