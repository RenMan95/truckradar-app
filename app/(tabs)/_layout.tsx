import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1A2E',
          borderTopColor: '#252542',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#8B8B9E',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Cerca', tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} /> }} />
      <Tabs.Screen name="publish" options={{ title: 'Pubblica', tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} /> }} />
      <Tabs.Screen name="my-listings" options={{ title: 'I Miei', tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profilo', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tabs>
  );
}
