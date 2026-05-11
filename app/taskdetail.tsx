import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ScrollView, Alert, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, Edit3, Trash2, Tag, Calendar as CalendarIcon,
  Clock, Save, AlignLeft, Flag, ChevronLeft, ChevronRight 
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { useTasksContext } from '../context/TasksContext';
import { Priority } from '../hooks/store';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function buildCalendar(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const firstDow = (firstDayOfMonth + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  const cells: { day: number; cur: boolean }[] = [];
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevMonthTotalDays - i, cur: false });
  for (let d = 1; d <= totalDays; d++) cells.push({ day: d, cur: true });
  const tail = 42 - cells.length;
  for (let d = 1; d <= tail; d++) cells.push({ day: d, cur: false });
  return cells;
}

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { completedTasks, tasks, updateTask, deleteTask } = useTasksContext();

  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState<any>(null);
  
  const [editTitle, setEditTitle] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('MEDIUM');
  const [editTimeDate, setEditTimeDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selDay, setSelDay] = useState(new Date().getDate());

  useEffect(() => {
    const foundTask = [...tasks, ...completedTasks].find((t: any) => t.id === id);
    if (foundTask) {
      setTask(foundTask);
      setEditTitle(foundTask.title || '');
      setEditDetails(foundTask.details || '');
      setEditCategory(foundTask.category || '');
      setEditPriority(foundTask.priority || 'MEDIUM');
      
      if (foundTask.scheduledDate) {
        const d = new Date(foundTask.scheduledDate);
        if (!isNaN(d.getTime())) {
          setCalYear(d.getFullYear());
          setCalMonth(d.getMonth());
          setSelDay(d.getDate());
        }
      }

      if (foundTask.time) {
        const timeMatch = foundTask.time.match(/(\d+):(\d+)/);
        if (timeMatch) {
          const d = new Date();
          let h = parseInt(timeMatch[1]);
          const m = parseInt(timeMatch[2]);
          const isPM = foundTask.time.toLowerCase().includes('pm');
          if (isPM && h < 12) h += 12;
          if (!isPM && h === 12 && foundTask.time.toLowerCase().includes('am')) h = 0;
          d.setHours(h, m, 0);
          setEditTimeDate(d);
        }
      }
    }
  }, [id, tasks, completedTasks]);

  const cells = buildCalendar(calYear, calMonth);
  const prevMonth = () => calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1);
  const nextMonth = () => calMonth === 11 ? (setCalMonth(0), setCalYear(y => y + 1)) : setCalMonth(m => m + 1);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selectedDate) setEditTimeDate(selectedDate);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return Alert.alert("Error", "Title wajib diisi");
    
    Alert.alert("Konfirmasi", "Simpan perubahan strategi ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Simpan", onPress: async () => {
          try {
            const newDateStr = `${MONTHS[calMonth]} ${selDay}, ${calYear}`;
            await updateTask(task.id, { 
              title: editTitle.trim(),
              details: editDetails.trim(),
              category: editCategory.trim(),
              priority: editPriority,
              time: formatTime(editTimeDate),
              scheduledDate: newDateStr
            });
            setIsEditing(false);
            Alert.alert("Berhasil", "Strategi telah diperbarui.");
          } catch (err) {
            Alert.alert("Error", "Gagal menyimpan data.");
          }
        }
      }
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Hapus Task", "Apakah Anda yakin ingin menghapus task ini secara permanen?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => { deleteTask(task.id); router.back(); } }
    ]);
  };

  if (!task) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={20} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{isEditing ? "ADJUST STRATEGY" : "TASK PREVIEW"}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>OBJECTIVE TITLE</Text>
              <TextInput style={styles.input} value={editTitle} onChangeText={setEditTitle} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONTEXT & DETAILS</Text>
              <TextInput style={[styles.input, styles.textarea]} value={editDetails} onChangeText={setEditDetails} multiline />
            </View>

            {/* Baris Jam & Kategori */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>TIME</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setShowTimePicker(true)}>
                  <Clock color="#7C6FFF" size={16} />
                  <Text style={styles.selectorText}>{formatTime(editTimeDate)}</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.label}>CATEGORY</Text>
                <TextInput style={styles.input} value={editCategory} onChangeText={setEditCategory} />
              </View>
            </View>

            {/* PICKER JAM MUNCUL DI SINI (TEPAT DI BAWAH ROW JAM/CATEGORY) */}
            {showTimePicker && (
              <View style={{ marginBottom: 20 }}>
                <DateTimePicker
                  value={editTimeDate}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                />
              </View>
            )}

            {/* Priority */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PRIORITY LEVEL</Text>
              <View style={styles.priorityRow}>
                {(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.priorityTab, editPriority === p && styles.priorityTabActive]}
                    onPress={() => setEditPriority(p)}
                  >
                    <Text style={[styles.priorityTabText, editPriority === p && styles.priorityTabTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Kalender */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TIMELINE ANCHOR</Text>
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
                    const isSelected = c.cur && c.day === selDay;
                    return (
                      <TouchableOpacity 
                        key={i} 
                        style={[styles.dayCell, isSelected && styles.dayCellSel]} 
                        onPress={() => c.cur && setSelDay(c.day)}
                      >
                        <Text style={[styles.dayCellText, !c.cur && styles.dayCellGhost, isSelected && styles.dayCellTextSel]}>{c.day}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
                <Text style={styles.btnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Save color="#fff" size={18} style={{marginRight: 6}} />
                <Text style={styles.btnText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.displayTitle}>{task.title}</Text>
            <View style={styles.detailCard}>
              <DetailItem icon={<AlignLeft color="#7C6FFF" size={18}/>} label="Details" value={task.details || 'No details.'} />
              <DetailItem icon={<CalendarIcon color="#7C6FFF" size={18}/>} label="Anchor Date" value={task.scheduledDate} />
              <DetailItem icon={<Clock color="#7C6FFF" size={18}/>} label="Time" value={task.time} />
              <DetailItem icon={<Tag color="#7C6FFF" size={18}/>} label="Category" value={task.category || 'General'} />
              <DetailItem 
                icon={<Flag color={task.priority === 'HIGH' ? '#FF5252' : '#7C6FFF'} size={18}/>} 
                label="Priority" 
                value={task.priority} 
                isHigh={task.priority === 'HIGH'}
              />
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                <Edit3 color="#fff" size={18} />
                <Text style={styles.editBtnText}>Edit Task</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Trash2 color="#FF5252" size={18} />
                <Text style={styles.deleteText}>Delete Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const DetailItem = ({ icon, label, value, isHigh }: any) => (
  <View style={styles.detailItem}>
    {icon}
    <View style={styles.detailTextCol}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, isHigh && { color: '#FF5252' }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D0D0F' },
  container: { flex: 1, paddingHorizontal: 24 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  backBtn: { width: 40, height: 40,marginLeft: 20, borderRadius: 12, backgroundColor: '#161618', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#222' },
  navTitle: { color: '#888', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginRight: 20 },
  displayTitle: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 24, marginTop: 10 },
  detailCard: { backgroundColor: '#161618', borderRadius: 20, padding: 20, gap: 20, marginBottom: 32, borderWidth: 1, borderColor: '#222' },
  detailItem: { flexDirection: 'row', gap: 16 },
  detailTextCol: { flex: 1 },
  detailLabel: { color: '#555', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  detailValue: { color: '#ddd', fontSize: 15, fontWeight: '600' },
  buttonGroup: { gap: 12 },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#7C6FFF', padding: 16, borderRadius: 14 },
  editBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#331111' },
  deleteText: { color: '#FF5252', fontWeight: '700' },
  editForm: { backgroundColor: '#161618', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#222', marginBottom: 50 },
  inputGroup: { marginBottom: 20 },
  label: { color: '#7C6FFF', fontSize: 10, fontWeight: '800', marginBottom: 10 },
  input: { color: '#fff', fontSize: 16, fontWeight: '600', borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 8 },
  textarea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  selector: { flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 8 },
  selectorText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  priorityRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  priorityTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: '#0D0D0F', borderWidth: 1, borderColor: '#222' },
  priorityTabActive: { backgroundColor: '#7C6FFF', borderColor: '#7C6FFF' },
  priorityTabText: { color: '#555', fontSize: 11, fontWeight: '700' },
  priorityTabTextActive: { color: '#fff' },
  calCard: { backgroundColor: '#0D0D0F', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#222' },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  calMonthYear: { color: '#fff', fontSize: 14, fontWeight: '600' },
  calNav: { flexDirection: 'row', gap: 8 },
  calNavBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#161618', alignItems: 'center', justifyContent: 'center' },
  dayLabels: { flexDirection: 'row', marginBottom: 6 },
  dayLabel: { flex: 1, textAlign: 'center', color: '#555', fontSize: 10, fontWeight: '600' },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  dayCell: { width: '14.28%', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  dayCellSel: { backgroundColor: '#7C6FFF' },
  dayCellText: { color: '#ccc', fontSize: 12 },
  dayCellGhost: { color: '#333' },
  dayCellTextSel: { color: '#fff', fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  saveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C6FFF', padding: 14, borderRadius: 12 },
  cancelBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#222', padding: 14, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: '700' }
});