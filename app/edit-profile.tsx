import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Globe, Palette, Check } from 'lucide-react-native';

import { useProfileContext } from '../context/ProfileContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, saveProfile } = useProfileContext();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [theme, setTheme] = useState(profile.theme);
  const [saving, setSaving] = useState(false);

  // Sync if profile changes externally
  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setBio(profile.bio);
    setLocation(profile.location);
    setTheme(profile.theme);
  }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Nama tidak boleh kosong.'); return; }
    if (!email.trim() || !email.includes('@')) { Alert.alert('Error', 'Email tidak valid.'); return; }
    setSaving(true);
    try {
      await saveProfile({
        ...profile,
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim(),
        location: location.trim(),
        theme,
      });
      // Go back immediately — profile screen will already show new data via context
      router.back();
    } catch {
      Alert.alert('Error', 'Gagal menyimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    const hasChanges =
      name !== profile.name ||
      email !== profile.email ||
      bio !== profile.bio ||
      location !== profile.location ||
      theme !== profile.theme;

    if (!hasChanges) { router.back(); return; }

    Alert.alert('Buang Perubahan?', 'Perubahan yang belum disimpan akan hilang.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Buang', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  const initials = name.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleDiscard} style={styles.backBtn}>
            <ArrowLeft color="#fff" size={20} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{initials}</Text>
          </View>
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              <TouchableOpacity style={styles.cameraBtn}>
                <Camera color="#fff" size={14} />
              </TouchableOpacity>
            </View>
            <Text style={styles.memberSince}>MEMBER SINCE {profile.memberSince}</Text>
            <Text style={styles.photoHint}>Recommended: 1000 × 1000px</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>NAMA LENGKAP</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#555" placeholder="Nama lengkap..." />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor="#555" placeholder="email@contoh.com" keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>BIO</Text>
            <TextInput style={[styles.input, styles.textarea]} value={bio} onChangeText={setBio} placeholderTextColor="#555" placeholder="Ceritakan sedikit tentang kamu..." multiline numberOfLines={5} textAlignVertical="top" />
          </View>

          <View style={styles.twoCol}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>LOCATION</Text>
              <View style={styles.iconInput}>
                <TextInput style={styles.iconInputText} value={location} onChangeText={setLocation} placeholderTextColor="#555" placeholder="City, Country" />
                <Globe color="#555" size={15} />
              </View>
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>THEME</Text>
              <View style={styles.iconInput}>
                <TextInput style={styles.iconInputText} value={theme} onChangeText={setTheme} placeholderTextColor="#555" placeholder="Theme name" />
                <Palette color="#555" size={15} />
              </View>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.discardBtn} onPress={handleDiscard}>
            <Text style={styles.discardText}>Discard{'\n'}Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            <Check color="#fff" size={18} />
            <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save\nChanges'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D0D0F' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1E1E1E' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#161618', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#7C6FFF', alignItems: 'center', justifyContent: 'center' },
  headerAvatarText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatarBox: { width: 100, height: 100, borderRadius: 20, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#2A2A4A' },
  avatarInitials: { color: '#7C6FFF', fontSize: 36, fontWeight: '700' },
  cameraBtn: { position: 'absolute', bottom: -4, right: -4, width: 30, height: 30, borderRadius: 15, backgroundColor: '#7C6FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0D0D0F' },
  memberSince: { color: '#666', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 4 },
  photoHint: { color: '#444', fontSize: 12 },
  field: { marginBottom: 18 },
  fieldLabel: { color: '#555', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#161618', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: '#2A2A2A' },
  textarea: { height: 110, paddingTop: 13 },
  twoCol: { flexDirection: 'row', gap: 12 },
  iconInput: { backgroundColor: '#161618', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A', gap: 8 },
  iconInputText: { flex: 1, color: '#fff', fontSize: 13 },
  actions: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, gap: 12, borderTopWidth: 1, borderTopColor: '#1E1E1E', backgroundColor: '#0D0D0F' },
  discardBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#161618', borderWidth: 1, borderColor: '#2A2A2A' },
  discardText: { color: '#888', fontSize: 14, fontWeight: '600', textAlign: 'center', lineHeight: 20 },
  saveBtn: { flex: 2, flexDirection: 'row', paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#7C6FFF', gap: 8, shadowColor: '#7C6FFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  saveText: { color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center', lineHeight: 20 },
});
