import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface AppHeaderProps {
  onSettingsPress?: () => void;
}

export default function AppHeader({ onSettingsPress }: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <View style={styles.avatar} />
        <Text style={styles.appName}>Midnight Focus</Text>
      </View>
      <TouchableOpacity onPress={() => router.push('/settings')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Settings color="#888" size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C6FFF',
    marginRight: 120,
  },
  appName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: -120,
  },
});
