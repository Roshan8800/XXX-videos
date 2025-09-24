import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';
import { Surface, ElevatedSurface } from '../../shared/components';

export type AdminScreen =
  | 'dashboard'
  | 'content-management'
  | 'user-management'
  | 'analytics'
  | 'content-moderation'
  | 'revenue-management'
  | 'settings'
  | 'notifications';

interface NavigationItem {
  id: AdminScreen;
  label: string;
  icon: string;
  badge?: number;
}

interface AdminNavigationProps {
  currentScreen: AdminScreen;
  onScreenChange: (screen: AdminScreen) => void;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
  },
  {
    id: 'content-management',
    label: 'Content',
    icon: 'video_library',
    badge: 3,
  },
  {
    id: 'user-management',
    label: 'Users',
    icon: 'people',
    badge: 12,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'analytics',
  },
  {
    id: 'content-moderation',
    label: 'Moderation',
    icon: 'security',
    badge: 5,
  },
  {
    id: 'revenue-management',
    label: 'Revenue',
    icon: 'trending_up',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'notifications',
    badge: 2,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
  },
];

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  currentScreen,
  onScreenChange,
}) => {
  const { colors } = useTheme();

  const NavigationItem: React.FC<{ item: NavigationItem }> = ({ item }) => {
    const isActive = currentScreen === item.id;

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: isActive ? colors.primaryContainer : 'transparent',
          borderRadius: 8,
          marginBottom: 4,
        }}
        onPress={() => onScreenChange(item.id)}
      >
        <View style={{
          width: 24,
          height: 24,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
          <Icon
            name={item.icon as any}
            size={20}
            color={isActive ? colors.onPrimaryContainer : colors.onSurfaceVariant}
          />
        </View>

        <Typography
          variant="bodyLarge"
          color={isActive ? 'onPrimaryContainer' : 'onSurfaceVariant'}
          style={{ flex: 1 }}
        >
          {item.label}
        </Typography>

        {item.badge && item.badge > 0 && (
          <View style={{
            backgroundColor: isActive ? colors.primary : colors.error,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 6,
          }}>
            <Typography
              variant="labelSmall"
              color={isActive ? 'onPrimary' : 'onError'}
            >
              {item.badge}
            </Typography>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Surface
      style={{
        width: 280,
        height: '100%',
        paddingVertical: 16,
      }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Typography variant="headlineSmall" color="onSurface">
          PlayNite Admin
        </Typography>
        <Typography variant="bodyMedium" color="onSurfaceVariant">
          Management Console
        </Typography>
      </View>

      {/* Navigation Items */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {navigationItems.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={{
        paddingHorizontal: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.outlineVariant,
        marginTop: 16,
      }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
          }}
        >
          <Icon name="close" size={20} color={colors.onSurfaceVariant} />
          <Typography
            variant="bodyMedium"
            color="onSurfaceVariant"
            style={{ marginLeft: 12 }}
          >
            Sign Out
          </Typography>
        </TouchableOpacity>
      </View>
    </Surface>
  );
};