/** Non-secret appearance preference. System color scheme is read in the UI hook. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemePreference = {
  mode: ThemeMode;
  setMode: (value: ThemeMode) => void;
};

export const useThemeStore = create<ThemePreference>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
    }),
    { name: 'appearance-preference-v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

// In your provider, combine useThemeStore(state => state.mode)
// with React Native useColorScheme() to derive the effective scheme.
// Keep NativeWind colorScheme and SystemUI/StatusBar in sync if using NativeWind.
