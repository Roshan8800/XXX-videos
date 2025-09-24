import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';
import { Surface } from '../../shared/components';
import { HapticTab } from '../../components/haptic-tab';
import { UserDrawer } from './user-drawer';
import { useNavigation } from '../../shared/utils/navigation-context';

export type UserScreen =
  | 'home'
  | 'browse'
  | 'search'
  | 'continue-watching'
  | 'watchlist'
  | 'downloads'
  | 'profile';

interface NavigationItem {
  id: UserScreen;
  label: string;
  icon: string;
  activeIcon?: string;
}

interface UserLayoutProps {
  initialScreen?: UserScreen;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    activeIcon: 'home',
  },
  {
    id: 'browse',
    label: 'Browse',
    icon: 'category',
    activeIcon: 'category',
  },
  {
    id: 'search',
    label: 'Search',
    icon: 'search',
    activeIcon: 'search',
  },
  {
    id: 'continue-watching',
    label: 'Continue',
    icon: 'play_circle',
    activeIcon: 'play_circle',
  },
  {
    id: 'watchlist',
    label: 'Watchlist',
    icon: 'playlist_add_check',
    activeIcon: 'playlist_add_check',
  },
  {
    id: 'downloads',
    label: 'Downloads',
    icon: 'download',
    activeIcon: 'download',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'person',
    activeIcon: 'person',
  },
];

export const UserLayout: React.FC<UserLayoutProps> = ({
  initialScreen = 'home',
}) => {
  const { colors } = useTheme();
  const { isDrawerOpen, setDrawerOpen } = useNavigation();
  const [currentScreen, setCurrentScreen] = useState<UserScreen>(initialScreen);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.onSurfaceVariant,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.outlineVariant,
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: 8,
            height: 68,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          tabBarActiveBackgroundColor: colors.primaryContainer + '20',
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'home' : 'home'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="browse"
          options={{
            title: 'Browse',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'category' : 'category'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'search' : 'search'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="continue-watching"
          options={{
            title: 'Continue',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'play_circle' : 'play_circle'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="watchlist"
          options={{
            title: 'Watchlist',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'favorite' : 'favorite'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="downloads"
          options={{
            title: 'Downloads',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'download' : 'download'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'person' : 'person'}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      {/* Drawer */}
      <UserDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});