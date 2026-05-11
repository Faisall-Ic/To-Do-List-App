import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type PriorityIntensity = 'deep' | 'standard' | 'maintenance';

export interface Task {
  id: string;
  title: string;
  details: string;
  time: string;
  priority: Priority;
  intensity: PriorityIntensity;
  category: string;
  scheduledDate: string; // e.g. "October 6, 2024"
  completed: boolean;
  completedAt?: string;
  duration?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  theme: string;
  isPremium: boolean;
  memberSince: string;
}

const TASKS_KEY = '@mf_tasks';
const COMPLETED_KEY = '@mf_completed';
const PROFILE_KEY = '@mf_profile';

// ─── Default data ────────────────────────────────────────────────
const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Finalize Architectural Deck',
    details: 'Review final structural layouts with the engineering lead before the 4PM sync.',
    time: '2:00 PM',
    priority: 'HIGH',
    intensity: 'deep',
    category: 'Design Studio',
    scheduledDate: 'October 6, 2024',
    completed: false,
  },
  {
    id: '2',
    title: 'Deep Work: UI Polish',
    details: 'Refine spacing, color tokens, and micro-interactions across all screens.',
    time: '2:00 PM',
    priority: 'MEDIUM',
    intensity: 'standard',
    category: 'Design Studio',
    scheduledDate: 'October 6, 2024',
    completed: false,
  },
  {
    id: '3',
    title: 'Team Performance Audit',
    details: 'Review KPIs and submit quarterly report to admin portal.',
    time: '5:30 PM',
    priority: 'MEDIUM',
    intensity: 'standard',
    category: 'Admin Portal',
    scheduledDate: 'October 6, 2024',
    completed: false,
  },
];

const defaultCompleted: Task[] = [
  {
    id: 'c1',
    title: 'Q1 Financial Architecture',
    details: 'High Priority',
    time: '04:30 PM',
    priority: 'HIGH',
    intensity: 'deep',
    category: 'Finance',
    scheduledDate: 'February 24, 2024',
    completed: true,
    completedAt: 'TODAY — FEB 24',
    duration: '2h 15m',
  },
  {
    id: 'c2',
    title: 'Vendor Security Audit',
    details: 'Compliance',
    time: '11:15 AM',
    priority: 'MEDIUM',
    intensity: 'standard',
    category: 'Compliance',
    scheduledDate: 'February 24, 2024',
    completed: true,
    completedAt: 'TODAY — FEB 24',
    duration: '45m',
  },
  {
    id: 'c3',
    title: 'Database Index Optimization',
    details: 'Technical',
    time: '03:45 PM',
    priority: 'MEDIUM',
    intensity: 'standard',
    category: 'Technical',
    scheduledDate: 'February 23, 2024',
    completed: true,
    completedAt: 'YESTERDAY — FEB 23',
    duration: '1h 10m',
  },
];

const defaultProfile: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@smartnote.ai',
  bio: "Digital Curator & Minimalist Architect. Crafting experiences that breathe in the Digital Atelier. Notes are the seeds of tomorrow's structures.",
  location: 'Copenhagen, DK',
  theme: 'Azure Light',
  isPremium: true,
  memberSince: '2023',
};

// ─── useTasks ────────────────────────────────────────────────────
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
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
  }, []);

  useEffect(() => { load(); }, []);

  const _saveTasks = async (updated: Task[]) => {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    setTasks(updated);
  };
  const _saveCompleted = async (updated: Task[]) => {
    await AsyncStorage.setItem(COMPLETED_KEY, JSON.stringify(updated));
    setCompletedTasks(updated);
  };

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'completed'>) => {
    const fresh: Task = { ...task, id: Date.now().toString(), completed: false };
    await _saveTasks([...tasks, fresh]);
  }, [tasks]);

  const updateTask = useCallback(async (id: string, patch: Partial<Task>) => {
    const updated = tasks.map(t => t.id === id ? { ...t, ...patch } : t);
    await _saveTasks(updated);
  }, [tasks]);

  const deleteTask = useCallback(async (id: string) => {
    await _saveTasks(tasks.filter(t => t.id !== id));
  }, [tasks]);

  const completeTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    const done: Task = {
      ...task,
      completed: true,
      completedAt: `TODAY — ${dateStr}`,
      duration: '—',
    };
    await Promise.all([
      _saveTasks(tasks.filter(t => t.id !== id)),
      _saveCompleted([done, ...completedTasks]),
    ]);
  }, [tasks, completedTasks]);

  const completionRate = Math.round(
    (completedTasks.length / Math.max(tasks.length + completedTasks.length, 1)) * 100
  );

  return { tasks, completedTasks, loading, addTask, updateTask, deleteTask, completeTask, completionRate, reload: load };
}

// ─── useProfile ──────────────────────────────────────────────────
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(PROFILE_KEY);
      if (stored) setProfile(JSON.parse(stored));
    } catch { /* use default */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const saveProfile = useCallback(async (updated: UserProfile) => {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    setProfile(updated);
  }, []);

  return { profile, loading, saveProfile };
}
