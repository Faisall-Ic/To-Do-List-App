import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { TasksProvider } from '../context/TasksContext';
import { ProfileProvider } from '../context/ProfileContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ProfileProvider>
      <TasksProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D0D0F' } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="edit-profile" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="addtask" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="security" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </TasksProvider>
    </ProfileProvider>
  );
}
