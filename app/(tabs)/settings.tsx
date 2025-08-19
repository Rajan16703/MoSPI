import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Globe, Shield, Download, CircleHelp as HelpCircle, LogOut, ChevronRight, Smartphone, Database, Wifi } from 'lucide-react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', hasArrow: true },
        { icon: Bell, label: 'Notifications', hasToggle: true, value: notifications, onToggle: setNotifications },
        { icon: Globe, label: 'Language & Region', subtitle: 'English (India)', hasArrow: true },
      ]
    },
    {
      title: 'Data & Privacy',
      items: [
        { icon: Shield, label: 'Privacy Settings', hasArrow: true },
        { icon: Database, label: 'Data Collection', hasToggle: true, value: dataCollection, onToggle: setDataCollection },
        { icon: Download, label: 'Export Data', hasArrow: true },
      ]
    },
    {
      title: 'App Preferences',
      items: [
        { icon: Wifi, label: 'Offline Sync', hasToggle: true, value: offlineSync, onToggle: setOfflineSync },
        { icon: Smartphone, label: 'Device Settings', hasArrow: true },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', hasArrow: true },
        { icon: LogOut, label: 'Sign Out', hasArrow: false },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AD</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Admin User</Text>
              <Text style={styles.profileRole}>Survey Administrator</Text>
              <Text style={styles.profileEmail}>admin@mospi.gov.in</Text>
            </View>
          </View>
        </View>

        {/* App Status */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>App Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
                <Text style={styles.statusText}>Online</Text>
              </View>
              <Text style={styles.statusValue}>Connected</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: '#1e40af' }]} />
                <Text style={styles.statusText}>Sync Status</Text>
              </View>
              <Text style={styles.statusValue}>Up to date</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: '#7c3aed' }]} />
                <Text style={styles.statusText}>Storage</Text>
              </View>
              <Text style={styles.statusValue}>2.4GB / 5GB</Text>
            </View>
          </View>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={styles.sectionTitle}>{group.title}</Text>
            <View style={styles.settingsCard}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex} 
                  style={[
                    styles.settingItem,
                    itemIndex === group.items.length - 1 && styles.lastItem
                  ]}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <item.icon size={20} color="#1e40af" />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingLabel}>{item.label}</Text>
                      {item.subtitle && (
                        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.settingRight}>
                    {item.hasToggle && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#d1d5db', true: '#1e40af' }}
                        thumbColor="#ffffff"
                      />
                    )}
                    {item.hasArrow && (
                      <ChevronRight size={20} color="#9ca3af" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>MoSPI Survey App v1.0.0</Text>
          <Text style={styles.appInfoText}>Ministry of Statistics & Programme Implementation</Text>
          <Text style={styles.appInfoText}>Government of India</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '600',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusCard: {
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
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingsGroup: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  appInfoText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
});