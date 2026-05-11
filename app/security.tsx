import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Key, ShieldCheck, Smartphone, Laptop, 
  History, Lock, Mail, ChevronRight, 
  LogOut, ArrowLeft 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SecurityScreen() {
  const router = useRouter();
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Security Protocol</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Pusat Keamanan</Text>
          <Text style={styles.mainSubtitle}>
            Lindungi catatan dan ide kreatif Anda dengan protokol keamanan tingkat lanjut.
          </Text>
        </View>

        {/* Card: Ubah Kata Sandi */}
        <View style={styles.card}>
          <View style={styles.iconBoxBlue}>
            <Key color="#7C6FFF" size={20} />
          </View>
          <Text style={styles.cardTitle}>Ubah Kata Sandi</Text>
          <Text style={styles.cardDesc}>
            Terakhir diperbarui 3 bulan yang lalu. Gunakan kombinasi simbol dan angka untuk keamanan maksimal.
          </Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Perbarui Sekarang {'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Card: 2FA */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.iconBoxBlue}>
              <ShieldCheck color="#7C6FFF" size={20} />
            </View>
            <Switch
              value={is2FAEnabled}
              onValueChange={setIs2FAEnabled}
              trackColor={{ false: '#2A2A2A', true: '#7C6FFF' }}
              thumbColor={'#fff'}
            />
          </View>
          <Text style={styles.cardTitle}>Otentikasi Dua Faktor (2FA)</Text>
          <Text style={styles.cardDesc}>
            Tambahkan lapisan keamanan ekstra pada akun Anda dengan kode verifikasi dari perangkat seluler.
          </Text>
          <View style={styles.badgeActive}>
            <ShieldCheck color="#7C6FFF" size={12} style={{marginRight: 6}} />
            <Text style={styles.badgeText}>AKTIF: GOOGLE AUTHENTICATOR</Text>
          </View>
        </View>

        {/* Section: Perangkat Terhubung */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Perangkat Terhubung</Text>
            <Text style={styles.sectionSubtitle}>Kelola perangkat yang memiliki akses ke akun Midnight Focus Anda.</Text>
          </View>
        </View>
        

        {/* Device List */}
        <View style={styles.deviceList}>
            <TouchableOpacity>
                <Text style={styles.logoutAllText}>Keluar dari Semua Sesi</Text>
            </TouchableOpacity>
          <DeviceItem 
            icon={<Laptop color="#888" size={22} />}
            name='MacBook Pro 14"' 
            desc="Jakarta, Indonesia • Safari di macOS Sonoma"
            isCurrent={true}
            />
            <DeviceItem 
            icon={<Smartphone color="#888" size={22} />}
            name="iPhone 15 Pro"
            desc="Bandung, Indonesia • Midnight Focus v2.4.1"
            />
            <DeviceItem 
            icon={<Smartphone color="#888" size={22} />}
            name='iPad Pro 12.9"' // Samain juga buat yang ini
            desc="Purwakarta, Indonesia • Midnight Focus v2.4.1"
            />
        </View>

        {/* Quick Actions Card */}
        <View style={styles.miniCardRow}>
          <QuickActionItem icon={<History color="#888" size={20} />} title="Log Aktivitas" sub="Lihat riwayat login" />
          <QuickActionItem icon={<Lock color="#888" size={20} />} title="Enkripsi Data" sub="Aktifkan end-to-end" />
          <QuickActionItem icon={<Mail color="#888" size={20} />} title="Notifikasi Login" sub="Peringatan akses" />
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Butuh Bantuan?</Text>
          <Text style={styles.helpSubtitle}>Hubungi tim dukungan kami jika Anda menemukan aktivitas yang tidak sah.</Text>
          <View style={styles.helpButtons}>
            <TouchableOpacity style={styles.btnSecondary}><Text style={styles.btnText}>Pusat Bantuan</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary}><Text style={styles.btnText}>Kontak Support</Text></TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-components
const DeviceItem = ({ icon, name, desc, isCurrent }: any) => (
  <View style={styles.deviceItem}>
    <View style={styles.deviceIcon}>{icon}</View>
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.deviceName}>{name}</Text>
        {isCurrent && <View style={styles.currentBadge}><Text style={styles.currentText}>SESI INI</Text></View>}
      </View>
      <Text style={styles.deviceDesc}>{desc}</Text>
    </View>
    <TouchableOpacity><LogOut color="#555" size={18} /></TouchableOpacity>
  </View>
);

const QuickActionItem = ({ icon, title, sub }: any) => (
  <TouchableOpacity style={styles.miniCard}>
    <View style={styles.iconBoxGray}>{icon}</View>
    <Text style={styles.miniCardTitle}>{title}</Text>
    <Text style={styles.miniCardSub}>{sub}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D0D0F' },
  container: { flex: 1, paddingHorizontal: 24 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#161618', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A2A2A', marginLeft: 20 },
  navTitle: { color: '#888', fontSize: 12, fontWeight: '600', letterSpacing: 1 },

  headerSection: { marginTop: 24, marginBottom: 32 },
  mainTitle: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 12 },
  mainSubtitle: { color: '#666', fontSize: 15, lineHeight: 22 },

  card: { backgroundColor: '#161618', borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: '#2A2A2A' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  iconBoxBlue: { width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(124, 111, 255, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  cardDesc: { color: '#666', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  linkText: { color: '#7C6FFF', fontWeight: '700', fontSize: 14 },

  badgeActive: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F1F22', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, alignSelf: 'flex-start' },
  badgeText: { color: '#7C6FFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  sectionHeaderRow: { flexDirection: 'row', marginBottom: 15, marginTop: 10 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 5 },
  sectionSubtitle: { color: '#555', fontSize: 12, marginTop: 4, marginLeft: 5 },
  logoutAllText: { color: '#FF5252', fontSize: 11, fontWeight: '700', textAlign: 'right', marginTop: 10, marginRight: 20, marginBottom: 10 },

  deviceList: { backgroundColor: '#161618', borderRadius: 24, paddingVertical: 10, paddingHorizontal: 3, marginBottom: 24, borderWidth: 1, borderColor: '#2A2A2A' },
  deviceItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  deviceIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1F1F22', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  deviceName: { color: '#fff', fontSize: 15, fontWeight: '700' },
  deviceDesc: { color: '#555', fontSize: 11, marginTop: 2 },
  currentBadge: { backgroundColor: '#7C6FFF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  currentText: { color: '#fff', fontSize: 8, fontWeight: '800' },

  miniCardRow: { gap: 12, marginBottom: 40 },
  miniCard: { backgroundColor: '#161618', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#2A2A2A' },
  iconBoxGray: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1F1F22', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  miniCardTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  miniCardSub: { color: '#555', fontSize: 12, marginTop: 2 },

  helpSection: { alignItems: 'center', paddingVertical: 40, borderTopWidth: 1, borderTopColor: '#222' },
  helpTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  helpSubtitle: { color: '#666', fontSize: 13, textAlign: 'center', marginBottom: 24 },
  helpButtons: { flexDirection: 'row', gap: 12 },
  btnPrimary: { flex: 1, backgroundColor: '#7C6FFF', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnSecondary: { flex: 1, backgroundColor: '#1F1F22', paddingVertical: 14, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});