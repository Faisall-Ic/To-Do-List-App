import React from 'react';
import {
  Modal, View, Text, TextInput,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Task, Priority } from '../hooks/store';

const PRIORITY_COLOR: Record<Priority, string> = {
  HIGH: '#FF4C6A',
  MEDIUM: '#F59E0B',
  LOW: '#10B981',
};

interface EditTaskModalProps {
  visible: boolean;
  title: string;
  details: string;
  time: string;
  category: string;
  priority: Priority;
  onChangeTitle: (v: string) => void;
  onChangeDetails: (v: string) => void;
  onChangeTime: (v: string) => void;
  onChangeCategory: (v: string) => void;
  onChangePriority: (v: Priority) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function EditTaskModal({
  visible,
  title,
  details,
  time,
  category,
  priority,
  onChangeTitle,
  onChangeDetails,
  onChangeTime,
  onChangeCategory,
  onChangePriority,
  onSave,
  onClose,
}: EditTaskModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Task</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X color="#888" size={20} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.label}>TITLE</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={onChangeTitle}
            placeholderTextColor="#555"
            placeholder="Judul task..."
          />

          {/* Details */}
          <Text style={styles.label}>DETAILS</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={details}
            onChangeText={onChangeDetails}
            placeholderTextColor="#555"
            placeholder="Deskripsi..."
            multiline
            textAlignVertical="top"
          />

          {/* Time + Category */}
          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>WAKTU</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={onChangeTime}
                placeholderTextColor="#555"
                placeholder="e.g. 3:00 PM"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>KATEGORI</Text>
              <TextInput
                style={styles.input}
                value={category}
                onChangeText={onChangeCategory}
                placeholderTextColor="#555"
                placeholder="Kategori..."
              />
            </View>
          </View>

          {/* Priority */}
          <Text style={styles.label}>PRIORITY</Text>
          <View style={styles.priorityRow}>
            {(['HIGH', 'MEDIUM', 'LOW'] as Priority[]).map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.priorityBtn, priority === p && { backgroundColor: PRIORITY_COLOR[p] }]}
                onPress={() => onChangePriority(p)}
              >
                <Text style={[styles.priorityBtnText, priority === p && { color: '#fff' }]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Save */}
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Check color="#fff" size={16} />
            <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  box: {
    backgroundColor: '#161618',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    color: '#666',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#0D0D0F',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  textarea: {
    height: 80,
    paddingTop: 12,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#0D0D0F',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  priorityBtnText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C6FFF',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
