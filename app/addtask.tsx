import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, Alert, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Settings, Target, Zap, Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import ini

import { Priority, PriorityIntensity } from '../hooks/store';
import { useTasksContext } from '../context/TasksContext';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function buildCalendar(year: number, month: number) {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const prevTotal = new Date(year, month, 0).getDate();
  const cells: { day: number; cur: boolean }[] = [];
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevTotal - i, cur: false });
  for (let d = 1; d <= total; d++) cells.push({ day: d, cur: true });
  const tail = 7 - (cells.length % 7);
  if (tail < 7) for (let d = 1; d <= tail; d++) cells.push({ day: d, cur: false });
  return cells;
}

const INTENSITY_TO_PRIORITY: Record<PriorityIntensity, Priority> = {
  deep: 'HIGH', standard: 'MEDIUM', maintenance: 'LOW',
};

export default function Addtask() {
  const router = useRouter();
  const { addTask } = useTasksContext();

  const [objective, setObjective] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('');
  const [intensity, setIntensity] = useState<PriorityIntensity>('deep');

  // State untuk Waktu (AM/PM)
  const [timeDate, setTimeDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selDay, setSelDay] = useState(now.getDate());

  const cells = buildCalendar(calYear, calMonth);
  const prevMonth = () => calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1);
  const nextMonth = () => calMonth === 11 ? (setCalMonth(0), setCalYear(y => y + 1)) : setCalMonth(m => m + 1);

  // Helper format jam AM/PM
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleDeploy = async () => {
    if (!objective.trim()) {
      Alert.alert('Error', 'Task objective wajib diisi.');
      return;
    }
    try {
      await addTask({
        title: objective.trim(),
        details: details.trim() || 'No details provided.',
        time: formatTime(timeDate), // Pakai hasil format picker
        priority: INTENSITY_TO_PRIORITY[intensity],
        intensity,
        category: category.trim() || 'General',
        scheduledDate: `${MONTHS[calMonth]} ${selDay}, ${calYear}`,
      });
      router.push('/(tabs)/');
    } catch {
      Alert.alert('Error', 'Gagal menambahkan task.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Settings color="#888" size={20} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>Create New{'\n'}Objective</Text>
          <Text style={styles.pageSubtitle}>Design your workflow with precision and intent.</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>TASK OBJECTIVE</Text>
          <TextInput style={styles.input} placeholder="e.g., Finalize Brand Architecture" placeholderTextColor="#555" value={objective} onChangeText={setObjective} />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>CONTEXT & DETAILS</Text>
          <TextInput style={[styles.input, styles.textarea]} placeholder="Define the scope..." placeholderTextColor="#555" multiline value={details} onChangeText={setDetails} />
        </View>

        <View style={styles.twoCol}>
          {/* BAGIAN JAM YANG DIUBAH */}
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>TIME</Text>
            <TouchableOpacity 
              style={styles.input} 
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Clock color="#7C6FFF" size={16} />
                <Text style={{ color: '#fff', fontSize: 14 }}>{formatTime(timeDate)}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>CATEGORY</Text>
            <TextInput style={styles.input} placeholder="e.g. Design" placeholderTextColor="#555" value={category} onChangeText={setCategory} />
          </View>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={timeDate}
            mode="time"
            is24Hour={false} // Format AM/PM
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowTimePicker(Platform.OS === 'ios');
              if (selectedDate) setTimeDate(selectedDate);
            }}
          />
        )}

        {/* ... Sisa kodenya (Intensity, Calendar, DeployBtn) tetap sama ... */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>PRIORITY INTENSITY</Text>
          <View style={styles.priorityCard}>
            {([
              { key: 'deep', label: 'Deep Focus' },
              { key: 'standard', label: 'Standard Flow' },
              { key: 'maintenance', label: 'Maintenance' },
            ] as const).map(opt => (
              <TouchableOpacity key={opt.key} style={styles.radioRow} onPress={() => setIntensity(opt.key)}>
                <View style={[styles.radio, intensity === opt.key && styles.radioOn]}>
                  {intensity === opt.key && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.radioLabel, intensity === opt.key && styles.radioLabelOn]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
            {intensity === 'deep' && (
              <View style={styles.impactBadge}>
                <Zap color="#FFD700" size={12} fill="#FFD700" />
                <Text style={styles.impactText}>HIGH IMPACT ZONE</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>TIMELINE ANCHOR</Text>
          <View style={styles.calCard}>
            <View style={styles.calHeader}>
              <Text style={styles.calMonthYear}>{MONTHS[calMonth]} {calYear}</Text>
              <View style={styles.calNav}>
                <TouchableOpacity onPress={prevMonth} style={styles.calNavBtn}><ChevronLeft color="#888" size={16} /></TouchableOpacity>
                <TouchableOpacity onPress={nextMonth} style={styles.calNavBtn}><ChevronRight color="#888" size={16} /></TouchableOpacity>
              </View>
            </View>
            <View style={styles.dayLabels}>
              {DAY_LABELS.map((d, i) => <Text key={i} style={styles.dayLabel}>{d}</Text>)}
            </View>
            <View style={styles.dayGrid}>
              {cells.map((c, i) => {
                const sel = c.cur && c.day === selDay;
                return (
                  <TouchableOpacity key={i} style={[styles.dayCell, sel && styles.dayCellSel]} onPress={() => c.cur && setSelDay(c.day)} activeOpacity={c.cur ? 0.7 : 1}>
                    <Text style={[styles.dayCellText, !c.cur && styles.dayCellGhost, sel && styles.dayCellTextSel]}>{c.day}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.deployBtn} onPress={handleDeploy} activeOpacity={0.85}>
          <Target color="#fff" size={18} />
          <Text style={styles.deployText}>Deploy Objective</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (Gunakan styles yang lama, tidak ada perubahan di CSS) ...
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10, justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#161618', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A2A2A' },
  safe: { flex: 1, backgroundColor: '#0D0D0F' },
  container: { flex: 1, paddingHorizontal: 20 },
  titleBlock: { paddingBottom: 24 },
  pageTitle: { color: '#fff', fontSize: 32, fontWeight: '700', lineHeight: 40, marginBottom: 8 },
  pageSubtitle: { color: '#666', fontSize: 13 },
  field: { marginBottom: 20 },
  fieldLabel: { color: '#555', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#161618', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 14, borderWidth: 1, borderColor: '#2A2A2A', justifyContent: 'center' },
  textarea: { height: 110, paddingTop: 13 },
  twoCol: { flexDirection: 'row', gap: 12 },
  priorityCard: { backgroundColor: '#161618', borderRadius: 14, padding: 16, gap: 16, borderWidth: 1, borderColor: '#2A2A2A' },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#444', alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: '#7C6FFF' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7C6FFF' },
  radioLabel: { color: '#888', fontSize: 15 },
  radioLabelOn: { color: '#fff', fontWeight: '600' },
  impactBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#2A2A2A' },
  impactText: { color: '#FFD700', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  calCard: { backgroundColor: '#161618', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#2A2A2A' },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  calMonthYear: { color: '#fff', fontSize: 15, fontWeight: '600' },
  calNav: { flexDirection: 'row', gap: 4 },
  calNavBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' },
  dayLabels: { flexDirection: 'row', marginBottom: 6 },
  dayLabel: { flex: 1, textAlign: 'center', color: '#555', fontSize: 12, fontWeight: '600' },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  dayCellSel: { backgroundColor: '#7C6FFF' },
  dayCellText: { color: '#ccc', fontSize: 13, fontWeight: '500' },
  dayCellGhost: { color: '#333' },
  dayCellTextSel: { color: '#fff', fontWeight: '700' },
  deployBtn: { backgroundColor: '#7C6FFF', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: '#7C6FFF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 14, elevation: 10 },
  deployText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});