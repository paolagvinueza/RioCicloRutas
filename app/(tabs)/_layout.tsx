import React from 'react';

import { Feather, FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { StatusBar } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';



export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <>    
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#692529',
          borderTopWidth: 0,
          bottom: 55,
          left: 14,
          right: 14,
          elevation: 5,
          borderRadius: 30,
          height: 70,
          paddingTop: 0
        }
      }}>
      <Tabs.Screen
        name="(inicio)"
        options={{
          headerShown: false,
          title: 'Início',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }} />
      <Tabs.Screen
        name="(gerarrota)"
        options={{
          headerShown: false,
          title: 'Gerar Rotas',
          tabBarIcon: ({ color }) => <FontAwesome name="bicycle" size={24} color={color} />,
          tabBarStyle: { display: 'none' }
        }} />
      <Tabs.Screen
        name="(minharota)"
        options={{
          headerShown: false,
          title: 'Minhas Rotas',
          headerTitleAlign: 'left',
          tabBarIcon: ({ color }) => <Feather name="map-pin" size={24} color={color} />,
        }} />
      <Tabs.Screen
        name="conta"
        options={{
          title: 'Minha Conta',
          headerTitleAlign: 'left',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }} />
    </Tabs>
    <StatusBar style='dark-content' />
    </>
    
  );
}
