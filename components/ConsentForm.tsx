import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Shield, Eye, Database, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';

interface ConsentFormProps {
  onComplete: () => void;
}

export function ConsentForm({ onComplete }: ConsentFormProps) {
  const [consents, setConsents] = useState({
    dataCollection: false,
    dataSharing: false,
    dataRetention: false,
  });

  const allConsentsGiven = Object.values(consents).every(Boolean);

  const toggleConsent = (key: keyof typeof consents) => {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const consentItems = [
    {
      id: 'dataCollection',
      title: 'Data Collection',
      description: 'I consent to the collection of my survey responses for statistical analysis by MoSPI.',
      icon: Database,
      required: true,
    },
    {
      id: 'dataSharing',
      title: 'Anonymous Data Sharing',
      description: 'I consent to sharing anonymized data with authorized government agencies for policy research.',
      icon: Eye,
      required: true,
    },
    {
      id: 'dataRetention',
      title: 'Data Retention',
      description: 'I understand that my data will be retained for 5 years as per government policy.',
      icon: Clock,
      required: true,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Shield size={48} color="#1e40af" />
        <Text style={styles.title}>Data Privacy & Consent</Text>
        <Text style={styles.subtitle}>
          Your privacy is important to us. Please review and provide consent for data processing.
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.privacyPolicy}>
          <Text style={styles.policyTitle}>Privacy Notice</Text>
          <Text style={styles.policyText}>
            This survey is conducted by the Ministry of Statistics & Programme Implementation (MoSPI) 
            for official statistical purposes. Your responses are confidential and will be used only 
            for statistical analysis and policy formulation. Personal identifiers will be removed 
            from the dataset.
          </Text>
        </View>

        <View style={styles.consentItems}>
          {consentItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.consentItem}
              onPress={() => toggleConsent(item.id as keyof typeof consents)}
            >
              <View style={styles.consentHeader}>
                <View style={styles.consentIcon}>
                  <item.icon size={20} color="#1e40af" />
                </View>
                <View style={styles.consentContent}>
                  <Text style={styles.consentTitle}>{item.title}</Text>
                  <Text style={styles.consentDescription}>{item.description}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  consents[item.id as keyof typeof consents] && styles.checkedBox
                ]}>
                  {consents[item.id as keyof typeof consents] && (
                    <CheckCircle size={16} color="#ffffff" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.legalInfo}>
          <Text style={styles.legalText}>
            By proceeding, you acknowledge that you have read and understood the privacy notice 
            and consent to the processing of your data as described above. You can withdraw 
            your consent at any time by contacting MoSPI.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.proceedButton, !allConsentsGiven && styles.disabledButton]}
        onPress={onComplete}
        disabled={!allConsentsGiven}
      >
        <Text style={[styles.proceedButtonText, !allConsentsGiven && styles.disabledButtonText]}>
          I Consent & Proceed
        </Text>
      </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  privacyPolicy: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 12,
  },
  policyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  consentItems: {
    marginBottom: 24,
  },
  consentItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  consentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  consentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  consentContent: {
    flex: 1,
    marginRight: 12,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  consentDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  legalInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  legalText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  proceedButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#e5e7eb',
  },
  proceedButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
});