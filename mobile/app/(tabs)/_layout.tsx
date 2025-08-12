import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: '#059D9F',
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 5 },
                paddingTop: 10,
              },
              android: {
                elevation: 10,
              },
            }),
          },
        ],
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, [string, string]> = {
            index: ['home-outline', 'home'],
            explore: ['clipboard-outline', 'clipboard'],
            calendar: ['calendar-outline', 'calendar'],
            globe: ['earth-outline', 'earth'],
            menu: ['menu-outline', 'menu'],
          };

          const [outline, filled] = icons[route.name] || ['help-outline', 'help'];
          const iconName = focused ? filled : outline;

          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendário' }} />
      <Tabs.Screen name="globe" options={{ title: 'Mundo' }} />
      <Tabs.Screen name="menu" options={{ title: 'Menu' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    zIndex: 10,
  },
});
