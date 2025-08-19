import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Globe, Shield, Download, CircleHelp as HelpCircle, LogOut, ChevronRight, Smartphone, Database, Wifi } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState } from 'react';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', hasArrow: true, hasToggle: false, action: undefined, subtitle: undefined, value: undefined, onToggle: undefined },
        { icon: Bell, label: 'Notifications', hasToggle: true, value: notifications, onToggle: setNotifications, action: undefined, subtitle: undefined },
               { icon: Globe, label: 'Language & Region', subtitle: 'English (India)', hasArrow: true, hasToggle: false, action: undefined, value: undefined }
      ]
    },
    {
      title: 'Data & Privacy',
      items: [
        { icon: Shield, label: 'Privacy Settings', hasArrow: true, hasToggle: false, action: undefined, subtitle: undefined, value: undefined, onToggle: undefined },
        { icon: Database, label: 'Data Collection', hasToggle: true, value: dataCollection, onToggle: setDataCollection, action: undefined, subtitle: undefined },
        { icon: Download, label: 'Export Data', hasArrow: true, hasToggle: false, action: undefined, subtitle: undefined, value: undefined, onToggle: undefined },
      ]
    },
    {
      title: 'App Preferences',
      items: [
        { icon: Wifi, label: 'Offline Sync', hasToggle: true, value: offlineSync, onToggle: setOfflineSync, action: undefined, subtitle: undefined },
        { icon: Smartphone, label: 'Device Settings', hasArrow: true, hasToggle: false, action: undefined, subtitle: undefined, value: undefined, onToggle: undefined },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', hasArrow: true, hasToggle: false, subtitle: undefined, value: undefined, onToggle: undefined },
        { icon: LogOut, label: 'Sign Out', hasArrow: false, action: signOut, hasToggle: false, subtitle: undefined, value: undefined, onToggle: undefined },
      ]
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <ThemeToggle />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>{user?.name}</Text>
              <Text style={[styles.profileRole, { color: colors.primary }]}>{user?.role}</Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* App Status */}
        <View style={styles.statusSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Status</Text>
          <View style={[styles.statusCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statusItem}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.statusText, { color: colors.text }]}>Online</Text>
              </View>
              <Text style={[styles.statusValue, { color: colors.textSecondary }]}>Connected</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.statusText, { color: colors.text }]}>Sync Status</Text>
              </View>
              <Text style={[styles.statusValue, { color: colors.textSecondary }]}>Up to date</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: '#7c3aed' }]} />
                <Text style={[styles.statusText, { color: colors.text }]}>Storage</Text>
              </View>
              <Text style={[styles.statusValue, { color: colors.textSecondary }]}>2.4GB / 5GB</Text>
            </View>
          </View>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{group.title}</Text>
            <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex} 
                  style={[
                    styles.settingItem,
                    itemIndex === group.items.length - 1 && styles.lastItem,
                    { borderBottomColor: colors.border }
                  ]}
                  onPress={item.action ? item.action : undefined}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: colors.primary + '15' }]}>
                      <item.icon size={20} color={colors.primary} />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                      {item.subtitle && (
                        <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.settingRight}>
                    {item.hasToggle && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: colors.border, true: colors.primary }}
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
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>MoSPI Survey App v1.0.0</Text>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>Ministry of Statistics & Programme Implementation</Text>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>Government of India</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
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
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
  },
  statusSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  statusCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
  },
  settingsGroup: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
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
  },
  settingSubtitle: {
    fontSize: 14,
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
    marginBottom: 4,
  },
});