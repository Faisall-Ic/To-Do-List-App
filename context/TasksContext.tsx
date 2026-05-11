import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../hooks/store';

const TASKS_KEY = '@mf_tasks';
const COMPLETED_KEY = '@mf_completed';

// --- Default Data (Tetap Sama) ---
const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Finalize Architectural Deck',
    details: 'Review final structural layouts with the engineering lead before the 4PM sync.',
    time: '14:00',
    priority: 'HIGH',
    intensity: 'deep',
    category: 'Design Studio',
    scheduledDate: 'October 6, 2024',
    completed: false,
  },
];

const defaultCompleted: Task[] = [
  {
    id: 'c1',
    title: 'Q1 Financial Architecture',
    details: 'High Priority analysis for the board.',
    time: '16:30',
    priority: 'HIGH',
    intensity: 'deep',
    category: 'Finance',
    scheduledDate: 'February 24, 2024',
    completed: true,
    completedAt: 'TODAY — FEB 24',
    duration: '2h 15m',
  },
];

interface TasksContextType {
  tasks: Task[];
  completedTasks: Task[];
  loading: boolean;
  completionRate: number;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data saat app dibuka
  useEffect(() => {
    (async () => {
      try {
        const [t, c] = await Promise.all([
          AsyncStorage.getItem(TASKS_KEY),
          AsyncStorage.getItem(COMPLETED_KEY),
        ]);
        setTasks(t ? JSON.parse(t) : defaultTasks);
        setCompletedTasks(c ? JSON.parse(c) : defaultCompleted);
      } catch {
        setTasks(defaultTasks);
        setCompletedTasks(defaultCompleted);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- ACTIONS ---

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'completed'>) => {
    const fresh: Task = { ...task, id: Date.now().toString(), completed: false };
    const updated = [...tasks, fresh];
    setTasks(updated);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
  }, [tasks]);

  // FIX: UpdateTask sekarang nge-scan list aktif DAN list archive
  const updateTask = useCallback(async (id: string, patch: Partial<Task>) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, ...patch } : t);
    const newCompleted = completedTasks.map(t => t.id === id ? { ...t, ...patch } : t);

    setTasks(newTasks);
    setCompletedTasks(newCompleted);

    await Promise.all([
      AsyncStorage.setItem(TASKS_KEY, JSON.stringify(newTasks)),
      AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify(newCompleted)),
    ]);
  }, [tasks, completedTasks]);

  // FIX: DeleteTask sekarang bisa hapus dari archive juga
  const deleteTask = useCallback(async (id: string) => {
    const newTasks = tasks.filter(t => t.id !== id);
    const newCompleted = completedTasks.filter(t => t.id !== id);

    setTasks(newTasks);
    setCompletedTasks(newCompleted);

    await Promise.all([
      AsyncStorage.setItem(TASKS_KEY, JSON.stringify(newTasks)),
      AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify(newCompleted)),
    ]);
  }, [tasks, completedTasks]);

  const completeTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    
    const done: Task = {
      ...task,
      completed: true,
      completedAt: `TODAY — ${dateStr}`,
      duration: 'Selesai',
    };

    const newTasks = tasks.filter(t => t.id !== id);
    const newCompleted = [done, ...completedTasks];

    setTasks(newTasks);
    setCompletedTasks(newCompleted);

    await Promise.all([
      AsyncStorage.setItem(TASKS_KEY, JSON.stringify(newTasks)),
      AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify(newCompleted)),
    ]);
  }, [tasks, completedTasks]);

  const completionRate = Math.round(
    (completedTasks.length / Math.max(tasks.length + completedTasks.length, 1)) * 100
  );

  return (
    <TasksContext.Provider value={{
      tasks, completedTasks, loading, completionRate,
      addTask, updateTask, deleteTask, completeTask,
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasksContext must be used within TasksProvider');
  return ctx;
}