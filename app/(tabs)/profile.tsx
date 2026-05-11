import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Switch, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, ShieldCheck, Bell, Moon, LogOut, Pencil, Crown } from 'lucide-react-native';

import { useProfileContext } from '../../context/ProfileContext';
import MenuItem from '../../components/MenuItem';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, saveProfile } = useProfileContext();

  const toggleTheme = () =>
    saveProfile({ ...profile, theme: profile.theme === 'Dark' ? 'Azure Light' : 'Dark' });

  const handleLogout = () =>
    Alert.alert('Keluar', 'Yakin mau keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: () => {} },
    ]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header - Dibuat lebih minimalist */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account Settings</Text>
          <View style={styles.statusDot} />
        </View>

        {/* Avatar Section - Lebih Pro Look */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <User color="#4F46E5" size={48} />
            </View>
            <TouchableOpacity style={styles.editAvatarBtn} onPress={() => router.push('/edit-profile')}>
              <Pencil color="#fff" size={14} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
          
          {profile.isPremium && (
            <View style={styles.premiumBadge}>
              <Crown color="#4F46E5" size={12} />
              <Text style={styles.premiumText}>PREMIUM MEMBER</Text>
            </View>
          )}
        </View>

        {/* Account Group */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferences</Text>
          <View style={styles.menuCard}>
            <MenuItem 
                icon={<User color="#4F46E5" size={18} />} 
                label="Edit Profile Information" 
                onPress={() => router.push('/edit-profile')} 
            />
            <View style={styles.divider} />
            <MenuItem 
                icon={<ShieldCheck color="#4F46E5" size={18} />} 
                label="Security & Privacy" 
                onPress={() => router.push('/security')} 
            />
            <View style={styles.divider} />
            <MenuItem 
                icon={<Bell color="#4F46E5" size={18} />} 
                label="Notification Settings" 
                onPress={() => {}} 
            />
          </View>
        </View>

        {/* Theme Card */}
        <View style={styles.section}>
          <View style={styles.themeCard}>
            <View style={styles.themeLeft}>
              <View style={styles.themeIconBox}>
                <Moon color="#4F46E5" size={18} />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.themeLabel}>Appearance</Text>
                <Text style={styles.themeSub}>
                  {profile.theme === 'Dark' ? 'Midnight Focus Enabled' : 'Light Mode Enabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={profile.theme !== 'Dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#27272A', true: '#4F46E5' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Logout - Dibuat simple tapi standout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut color="#EF4444" size={18} />
          <Text style={styles.logoutText}>Sign Out Account</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>MIDNIGHT FOCUS ENGINE</Text>
          <Text style={styles.footerVersion}>Build 2.4.0 — 2026</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#09090B' },
  container: { flex: 1, paddingHorizontal: 24 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 20 
  },
  headerTitle: { color: '#F4F4F5', fontSize: 16, fontWeight: '700', letterSpacing: -0.5 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },

  avatarSection: { alignItems: 'center', paddingVertical: 30 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatarCircle: { 
    width: 100, height: 100, borderRadius: 50, 
    backgroundColor: '#18181B', alignItems: 'center', 
    justifyContent: 'center', borderWidth: 1, borderColor: '#27272A' 
  },
  editAvatarBtn: { 
    position: 'absolute', bottom: 4, right: 4, 
    width: 32, height: 32, borderRadius: 16, 
    backgroundColor: '#4F46E5', alignItems: 'center', 
    justifyContent: 'center', borderWidth: 3, borderColor: '#09090B' 
  },
  profileName: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -1 },
  profileEmail: { color: '#71717A', fontSize: 14, marginTop: 2, marginBottom: 12 },
  
  premiumBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(79, 70, 229, 0.1)', 
    borderRadius: 12, paddingHorizontal: 12, 
    paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(79, 70, 229, 0.2)' 
  },
  premiumText: { color: '#4F46E5', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  section: { marginBottom: 20 },
  sectionLabel: { 
    color: '#3F3F46', fontSize: 11, fontWeight: '800', 
    letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' 
  },
  
  menuCard: { 
    backgroundColor: '#18181B', borderRadius: 20, 
    borderWidth: 1, borderColor: '#27272A', overflow: 'hidden' 
  },
  divider: { height: 1, backgroundColor: '#27272A', marginLeft: 60 },

  themeCard: { 
    backgroundColor: '#18181B', borderRadius: 20, padding: 18, 
    flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'space-between', borderWidth: 1, borderColor: '#27272A' 
  },
  themeLeft: { flexDirection: 'row', alignItems: 'center' },
  themeIconBox: { 
    width: 38, height: 38, borderRadius: 12, 
    backgroundColor: '#09090B', alignItems: 'center', justifyContent: 'center' 
  },
  themeLabel: { color: '#F4F4F5', fontSize: 15, fontWeight: '600' },
  themeSub: { color: '#71717A', fontSize: 12, marginTop: 1 },

  logoutBtn: { 
    flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'center', backgroundColor: 'rgba(239, 68, 68, 0.05)', 
    borderRadius: 20, paddingVertical: 18, gap: 10, 
    marginTop: 10, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.1)' 
  },
  logoutText: { color: '#EF4444', fontSize: 15, fontWeight: '700' },

  footer: { alignItems: 'center', opacity: 0.5 },
  footerBrand: { color: '#71717A', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  footerVersion: { color: '#52525B', fontSize: 11, marginTop: 4 },
});