import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Construction } from 'lucide-react-native';

export default function FocusScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Icon Visual */}
        <View style={styles.iconCircle}>
          <Clock color="#7C6FFF" size={40} strokeWidth={1.5} />
        </View>

        {/* Teks Utama */}
        <Text style={styles.title}>Focus</Text>
        
        {/* Badge Coming Soon */}
        <View style={styles.badge}>
          <Construction color="#7C6FFF" size={12} style={{ marginRight: 6 }} />
          <Text style={styles.badgeText}>UNDER DEVELOPMENT</Text>
        </View>

        {/* Progress Bar Mini (Visual Decor) */}
        <Text style={styles.percentage}>Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D0D0F' },
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 40 
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#161618',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 12 
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 111, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(124, 111, 255, 0.2)',
    marginBottom: 20,
  },
  badgeText: {
    color: '#7C6FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: { 
    color: '#666', 
    fontSize: 15, 
    textAlign: 'center', 
    lineHeight: 22,
    marginBottom: 40 
  },
  progressTrack: {
    width: '60%',
    height: 4,
    backgroundColor: '#161618',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  percentage: {
    color: '#444',
    fontSize: 12,
    fontWeight: '500',
  }
});