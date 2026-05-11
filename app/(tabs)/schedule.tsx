import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, TrendingUp, History, Activity } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { useTasksContext } from '../../context/TasksContext';
import AppHeader from '../../components/AppHeader';
import EmptyState from '../../components/EmptyState';

export default function ScheduleScreen() {
  const { completedTasks } = useTasksContext();
  const router = useRouter();

  const grouped: Record<string, typeof completedTasks> = {};
  completedTasks.forEach(t => {
    const key = t.completedAt || 'Today — Feb 24'; // Contoh format biar mirip figma
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header di dalem ScrollView biar margin aman */}
        <AppHeader />

        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>Task Archive</Text>
          <Text style={styles.pageSubtitle}>A historical log of your productivity flow.</Text>
        </View>

        {completedTasks.length === 0 ? (
          <EmptyState
            title="Empty Archive"
            subtitle="Completed tasks will appear here."
            icon={<History color="#27272A" size={48} />}
          />
        ) : (
          Object.entries(grouped).map(([date, list]) => (
            <View key={date} style={styles.group}>
              <Text style={styles.groupDate}>{date.toUpperCase()}</Text>
              {list.map(task => (
                <TouchableOpacity 
                  key={task.id} 
                  style={styles.taskCard}
                  activeOpacity={0.7}
                  onPress={() => router.push({
                    pathname: '/taskdetail',
                    params: { id: task.id }
                  })}
                >
                  <View style={styles.taskIcon}>
                    <CheckCircle2 color="#4F46E5" size={16} />
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskMeta}>
                      {task.duration ? `Completed in ${task.duration}` : 'Verified'} • {task.category}
                    </Text>
                  </View>
                  <View style={styles.taskRight}>
                    <Text style={styles.taskTime}>{task.time}</Text>
                    <Text style={styles.verifiedBadge}>VERIFIED</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}

        {/* SECTION REPORT - Dibuat lebih Mirip Figma Image 2 */}
        {completedTasks.length > 0 && (
          <View style={styles.reportSection}>
            <View style={styles.reportHeader}>
              <Activity color="#4F46E5" size={18} />
              <Text style={styles.reportTitle}>Efficiency Report</Text>
            </View>

            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>WEEKLY EFFICIENCY SCORE</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreValue}>94%</Text>
                <TrendingUp color="#fff" size={24} />
              </View>
              <Text style={styles.scoreDesc}>
                Your focus duration has increased by <Text style={{fontWeight: '700'}}>12%</Text> compared to last week. Peak performance detected between 9 AM and 11 AM.
              </Text>
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.statCard, { flex: 1 }]}>
                <Text style={styles.statLabel}>TOTAL FOCUSED TIME</Text>
                <Text style={styles.statValue}>42h 15m</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '72%' }]} />
                </View>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View>
                  <Text style={styles.statLabel}>TASKS RESOLVED</Text>
                  <Text style={styles.statValue}>{completedTasks.length}</Text>
                </View>
                <Text style={styles.statSub}>+12 Today</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#09090B' }, // Lebih pekat
  container: { flex: 1, paddingHorizontal: 24 }, // Konsisten dengan index.tsx
  titleBlock: { paddingVertical: 20 },
  pageTitle: { color: '#fff', fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  pageSubtitle: { color: '#71717A', fontSize: 14, marginTop: 4 },
  
  group: { marginBottom: 28 },
  groupDate: { color: '#3F3F46', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  
  taskCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#18181B', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#27272A' 
  },
  taskIcon: { 
    width: 32, height: 32, borderRadius: 10, 
    backgroundColor: 'rgba(79, 70, 229, 0.1)', 
    alignItems: 'center', justifyContent: 'center' 
  },
  taskInfo: { flex: 1, marginLeft: 12 },
  taskTitle: { color: '#F4F4F5', fontSize: 15, fontWeight: '600' },
  taskMeta: { color: '#71717A', fontSize: 12, marginTop: 2 },
  
  taskRight: { alignItems: 'flex-end' },
  taskTime: { color: '#A1A1AA', fontSize: 12, fontWeight: '500' },
  verifiedBadge: { color: '#10B981', fontSize: 8, fontWeight: '800', marginTop: 4 },

  reportSection: { marginTop: 10 },
  reportHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  reportTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },

  scoreCard: { backgroundColor: '#4F46E5', borderRadius: 20, padding: 24, marginBottom: 12 },
  scoreLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  scoreValue: { color: '#fff', fontSize: 48, fontWeight: '800' },
  scoreDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 20 },

  statCard: { 
    backgroundColor: '#18181B', borderRadius: 16, padding: 20, 
    marginBottom: 12, borderWidth: 1, borderColor: '#27272A' 
  },
  statLabel: { color: '#71717A', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
  statValue: { color: '#fff', fontSize: 28, fontWeight: '800' },
  statSub: { color: '#71717A', fontSize: 12, fontWeight: '600' },
  
  progressBar: { height: 4, backgroundColor: '#27272A', borderRadius: 10, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4F46E5' },
});