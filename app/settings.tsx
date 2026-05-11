import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Shield, Palette, Globe, Info, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Workspace Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.overline}>PERSONALIZE WORKSPACE</Text>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Refine your creative environment. Manage your identity, visual preferences, and localized experience.
          </Text>
        </View>

        {/* Section: Akun */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircleBlue}><User color="#7C6FFF" size={20} /></View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Akun</Text>
              <Text style={styles.cardSubtitle}>Profile & Subscription</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.listItem} onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.listItemLeft}>
              <User color="#888" size={18} />
              <Text style={styles.listItemText}>Informasi Profil</Text>
            </View>
            <ChevronRight color="#444" size={18} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => router.push('/security')}>
            <View style={styles.listItemLeft}>
              <Shield color="#888" size={18} />
              <Text style={styles.listItemText}>Keamanan</Text>
            </View>
            <ChevronRight color="#444" size={18} />
          </TouchableOpacity>
        </View>

        {/* Section: Tampilan */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircleBlue}><Palette color="#7C6FFF" size={20} /></View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Tampilan</Text>
              <Text style={styles.cardSubtitle}>Themes & Typography</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={['#7C6FFF', '#5046E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.themeButton}
            >
              <Text style={styles.themeButtonText}>Buka Galeri Tema</Text>
              <Text style={styles.themeButtonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.previewContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop' }} 
              style={styles.previewImage} 
            />
            <View style={styles.previewOverlay}>
                <View style={styles.previewCardMini}>
                    <View style={styles.previewLineLong} />
                    <View style={styles.previewLineShort} />
                </View>
            </View>
          </View>
        </View>

        {/* Section: Bahasa */}
        <View style={styles.miniCard}>
          <View style={styles.miniCardLeft}>
            <View style={styles.iconCircleDark}><Globe color="#7C6FFF" size={20} /></View>
            <View>
              <Text style={styles.cardTitleSmall}>Bahasa</Text>
              <Text style={styles.cardSubtitleSmall}>Indonesia (ID)</Text>
            </View>
          </View>
          <TouchableOpacity><Text style={styles.ubahText}>Ubah</Text></TouchableOpacity>
        </View>

        {/* Section: Tentang Aplikasi */}
        <TouchableOpacity style={styles.miniCardGray}>
          <View style={styles.miniCardLeft}>
            <View style={styles.iconCircleDark}><Info color="#888" size={20} /></View>
            <View>
              <Text style={styles.cardTitleSmall}>Tentang Aplikasi</Text>
              <Text style={styles.cardSubtitleSmall}>v2.4.0 • Enterprise Edition</Text>
            </View>
          </View>
          <ChevronRight color="#444" size={18} />
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Midnight Focus</Text>
          <Text style={styles.footerCredit}>DESIGNED FOR DIGITAL CRAFTSMEN</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Privacy</Text>
            <Text style={styles.footerLink}>Terms</Text>
            <Text style={styles.footerLink}>Support</Text>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D0D0F' },
  container: { flex: 1, paddingHorizontal: 24 },
  
  // Navigation Bar
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: { 
    width: 40, height: 40, borderRadius: 12, 
    backgroundColor: '#161618', alignItems: 'center', 
    justifyContent: 'center', borderWidth: 1, borderColor: '#2A2A2A' 
  },
  navTitle: { color: '#888', fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },

  header: { marginTop: 20, marginBottom: 30 },
  overline: { color: '#7C6FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  title: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 12 },
  subtitle: { color: '#666', fontSize: 14, lineHeight: 22 },
  
  // Cards
  card: { backgroundColor: '#161618', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#2A2A2A' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconCircleBlue: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#7C6FFF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardHeaderText: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  cardSubtitle: { fontSize: 11, color: '#555', marginTop: 2 },
  
  listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1F1F22', padding: 14, borderRadius: 14, marginBottom: 10 },
  listItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  listItemText: { fontSize: 14, fontWeight: '600', color: '#ccc' },

  themeButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 16, marginBottom: 15 },
  themeButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  themeButtonArrow: { color: '#FFF', marginLeft: 8, fontSize: 16 },

  previewContainer: { height: 140, borderRadius: 18, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: '#2A2A2A' },
  previewImage: { width: '100%', height: '100%', opacity: 0.6 },
  previewOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: 15 },
  previewCardMini: { backgroundColor: '#222', padding: 10, borderRadius: 10, width: '80%', borderWeight: 1, borderColor: '#333' },
  previewLineLong: { height: 4, backgroundColor: '#7C6FFF', borderRadius: 2, width: '40%', marginBottom: 6 },
  previewLineShort: { height: 4, backgroundColor: '#444', borderRadius: 2, width: '20%' },

  miniCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#161618', padding: 16, borderRadius: 24, marginBottom: 15, borderWidth: 1, borderColor: '#2A2A2A' },
  miniCardGray: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#161618', padding: 16, borderRadius: 24, marginBottom: 30, borderWidth: 1, borderColor: '#222' },
  miniCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconCircleDark: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1F1F22', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A2A2A' },
  cardTitleSmall: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cardSubtitleSmall: { fontSize: 11, color: '#555' },
  ubahText: { color: '#7C6FFF', fontWeight: '700', fontSize: 13 },

  footer: { alignItems: 'center', marginTop: 20, opacity: 0.5 },
  footerBrand: { fontSize: 16, fontWeight: '700', color: '#444', marginBottom: 4 },
  footerCredit: { fontSize: 8, fontWeight: '800', color: '#333', letterSpacing: 1 },
  footerLinks: { flexDirection: 'row', gap: 16, marginTop: 12 },
  footerLink: { fontSize: 11, color: '#444', fontWeight: '600' }
});