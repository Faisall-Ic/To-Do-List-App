import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export default function MenuItem({ icon, label, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconBox}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
      <ChevronRight color="#444" size={16} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#1E1E30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    color: '#ddd',
    fontSize: 15,
    fontWeight: '500',
  },
});
