import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'Tidak ada data',
  subtitle,
  icon,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon ?? <CheckCircle2 color="#333" size={36} />}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  title: {
    color: '#555',
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    color: '#333',
    fontSize: 13,
  },
});
