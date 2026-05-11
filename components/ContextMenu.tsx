import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Pencil, CheckCircle2, Trash2 } from 'lucide-react-native';

interface ContextMenuProps {
  onEdit: () => void;
  onComplete: () => void;
  onDelete: () => void;
}

export default function ContextMenu({ onEdit, onComplete, onDelete }: ContextMenuProps) {
  return (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.item} onPress={onEdit}>
        <Pencil color="#7C6FFF" size={15} />
        <Text style={styles.itemText}>Edit</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.item} onPress={onComplete}>
        <CheckCircle2 color="#10B981" size={15} />
        <Text style={[styles.itemText, { color: '#10B981' }]}>Selesai</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.item} onPress={onDelete}>
        <Trash2 color="#FF4C6A" size={15} />
        <Text style={[styles.itemText, { color: '#FF4C6A' }]}>Hapus</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    right: 12,
    top: 44,
    backgroundColor: '#1E1E28',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A3A',
    zIndex: 99,
    minWidth: 140,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  itemText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A3A',
  },
});
