import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Zap, MoreHorizontal, CheckCircle2 } from 'lucide-react-native';
import { Task, Priority } from '../hooks/store';
import ContextMenu from './ContextMenu';

const PRIORITY_COLOR: Record<Priority, string> = {
  HIGH: '#FF4C6A',
  MEDIUM: '#F59E0B',
  LOW: '#10B981',
};

interface TaskCardProps {
  task: Task;
  variant: 'active' | 'row';
  menuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

export default function TaskCard({
  task,
  variant,
  menuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
  onComplete,
}: TaskCardProps) {
  if (variant === 'active') {
    return (
      <View style={styles.activeCard}>
        <View style={styles.activeTop}>
          <View style={styles.zapBox}>
            <Zap color="#FFD700" size={16} />
          </View>
          <View style={styles.activeTopRight}>
            <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLOR[task.priority] }]}>
              <Text style={styles.priorityBadgeText}>{task.priority}</Text>
            </View>
            <TouchableOpacity onPress={onMenuToggle} style={styles.menuBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MoreHorizontal color="#888" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.activeTitle}>{task.title}</Text>
        <Text style={styles.activeDesc}>{task.details}</Text>
        <Text style={styles.activeMeta}>{task.time} • {task.category}</Text>

        {menuOpen && (
          <ContextMenu onEdit={onEdit} onComplete={onComplete} onDelete={onDelete} />
        )}

        <TouchableOpacity style={styles.completeBtn} onPress={onComplete}>
          <CheckCircle2 color="#fff" size={15} />
          <Text style={styles.completeBtnText}>Mark Complete</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // variant === 'row'
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.checkbox} onPress={onComplete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} />
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{task.title}</Text>
        <Text style={styles.rowMeta}>{task.time} • {task.category}</Text>
      </View>
      <TouchableOpacity onPress={onMenuToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <MoreHorizontal color="#555" size={18} />
      </TouchableOpacity>
      {menuOpen && (
        <ContextMenu onEdit={onEdit} onComplete={onComplete} onDelete={onDelete} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Active card
  activeCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A4A',
    position: 'relative',
  },
  activeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  zapBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#2A2A4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  menuBtn: { padding: 4 },
  activeTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  activeDesc: {
    color: '#888',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 6,
  },
  activeMeta: {
    color: '#555',
    fontSize: 12,
    marginBottom: 16,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    backgroundColor: '#7C6FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  completeBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161618',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#222',
    position: 'relative',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#444',
  },
  rowInfo: { flex: 1 },
  rowTitle: {
    color: '#ddd',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
  rowMeta: {
    color: '#555',
    fontSize: 12,
  },
});
