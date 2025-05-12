import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';
import { StatusBar } from 'react-native';
export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
      <Stack initialRouteName="inicio">
        <Stack.Screen name="inicio" options={{ headerShown: false }} />
        <Stack.Screen name="detalhes" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
  );
}
