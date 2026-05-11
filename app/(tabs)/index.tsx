import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, LayoutGrid } from 'lucide-react-native';

import { Task, Priority } from '../../hooks/store';
import { useTasksContext } from '../../context/TasksContext';
import AppHeader from '../../components/AppHeader';
import TaskCard from '../../components/TaskCard';
import EmptyState from '../../components/EmptyState';
import EditTaskModal from '../../components/EditTaskModal';

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, completionRate, completeTask, updateTask, deleteTask } = useTasksContext();

  const [menuId, setMenuId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  
  // State untuk Edit Modal (Sesuai kode awal lu)
  const [editTitle, setEditTitle] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('MEDIUM');
  const [editCategory, setEditCategory] = useState('');

  const openEdit = (task: Task) => {
    setEditTarget(task);
    setEditTitle(task.title);
    setEditDetails(task.details);
    setEditTime(task.time);
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    try {
      await updateTask(editTarget.id, {
        title: editTitle.trim(),
        details: editDetails.trim(),
        time: editTime.trim(),
        priority: editPriority,
        category: editCategory.trim(),
      });
      setEditTarget(null);
    } catch {
      Alert.alert('Error', 'Gagal menyimpan.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setMenuId(null)}
      >
        {/* Header di dalem ScrollView biar margin kiri-kanan aman */}
        <AppHeader />

        {/* STATS - Dibuat lebih bold ala Figma Dashboard */}
        <View style={styles.statsBlock}>
          <Text style={styles.percentage}>{completionRate}%</Text>
          <Text style={styles.statsDesc}>
            Daily momentum achieved. You're outperforming <Text style={{color: '#fff'}}>92%</Text> of peers today.
          </Text>
          <View style={styles.barChart}>
            {[40, 65, 80, 55, 90, 70, completionRate].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h * 0.45, opacity: i === 6 ? 1 : 0.3 }]} />
            ))}
          </View>
        </View>

        {/* LIST TASK */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Today's Focus</Text>
            <Text style={styles.taskCount}>{tasks.length} Objectives</Text>
          </View>

          {tasks.length === 0 ? (
            <EmptyState title="All tasks done! 🎉" subtitle="Tap + to add a new task" />
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                variant={task.priority === 'HIGH' ? 'full' : 'row'}
                menuOpen={menuId === task.id}
                onMenuToggle={() => setMenuId(prev => prev === task.id ? null : task.id)}
                onEdit={() => openEdit(task)}
                onDelete={() => {/* logic delete lu */}}
                onComplete={() => {/* logic complete lu */}}
              />
            ))
          )}
        </View>

        {/* INSIGHT CARD - Sentuhan pembeda dari repo temen lu */}
        <View style={styles.section}>
          <View style={styles.insightCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12}}>
              <LayoutGrid size={14} color="#7C6FFF" />
              <Text style={styles.insightTitle}>PRODUCTIVITY INSIGHTS</Text>
            </View>
            <Text style={styles.insightText}>• Peak flow at 10:45 AM today</Text>
            <Text style={styles.insightText}>• 3 meetings avoided this week</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB SQUIRCLE */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/addtask')}>
        <Plus color="#fff" size={26} />
      </TouchableOpacity>

      <EditTaskModal
        visible={!!editTarget}
        title={editTitle}
        details={editDetails}
        time={editTime}
        category={editCategory}
        priority={editPriority}
        onChangeTitle={setEditTitle}
        onChangeDetails={setEditDetails}
        onChangeTime={setEditTime}
        onChangeCategory={setEditCategory}
        onChangePriority={setEditPriority}
        onSave={handleSaveEdit}
        onClose={() => setEditTarget(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D0D0F' },
  container: { flex: 1, paddingHorizontal: 20 },
  statsBlock: { paddingVertical: 10 },
  percentage: { color: '#fff', fontSize: 58, fontWeight: '800', letterSpacing: -2 },
  statsDesc: { color: '#666', fontSize: 13, lineHeight: 20, width: '80%' },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 20, height: 48 },
  bar: { width: 10, backgroundColor: '#7C6FFF', borderRadius: 2 },
  
  section: { marginTop: 30 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  taskCount: { color: '#444', fontSize: 12 },

  insightCard: { backgroundColor: '#161618', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#222' },
  insightTitle: { color: '#7C6FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  insightText: { color: '#888', fontSize: 13, marginBottom: 4 },

  fab: {
    position: 'absolute', bottom: 30, right: 24,
    width: 56, height: 56, borderRadius: 18, // Bentuk squircle biar beda
    backgroundColor: '#7C6FFF', alignItems: 'center', justifyContent: 'center',
    elevation: 8,
  },
});