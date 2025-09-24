import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../shared/utils/theme-context';

export const UserStack: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.onSurface,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false, // Hide header for home since it has its own AppBar
        }}
      />
      <Stack.Screen
        name="browse"
        options={{
          title: 'Browse',
          headerShown: false, // Hide header for browse since it has its own AppBar
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: false, // Hide header for search since it has its own AppBar
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false, // Hide header for profile since it has its own AppBar
        }}
      />
      <Stack.Screen
        name="categories"
        options={{
          title: 'Categories',
        }}
      />
      <Stack.Screen
        name="search-results"
        options={{
          title: 'Search Results',
        }}
      />
      <Stack.Screen
        name="video-playback"
        options={{
          title: 'Video Player',
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="recommendations"
        options={{
          title: 'Recommendations',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="live-streams"
        options={{
          title: 'Live Streams',
          headerShown: false, // Hide header since it has its own AppBar
        }}
      />
      <Stack.Screen
        name="premium-content"
        options={{
          title: 'Premium Content',
          headerShown: false, // Hide header since it has its own AppBar
        }}
      />
    </Stack>
  );
};