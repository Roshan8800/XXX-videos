import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';
import { Surface, ElevatedSurface } from '../../shared/components';
import { UserScreen } from './user-layout';

interface NavigationItem {
  id: UserScreen;
  label: string;
  icon: string;
  badge?: number;
  color?: string;
}

interface UserNavigationProps {
  currentScreen: UserScreen;
  onScreenChange: (screen: UserScreen) => void;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
  },
  {
    id: 'browse',
    label: 'Browse',
    icon: 'category',
  },
  {
    id: 'search',
    label: 'Search',
    icon: 'search',
  },
  {
    id: 'continue-watching',
    label: 'Continue Watching',
    icon: 'play_circle',
  },
  {
    id: 'watchlist',
    label: 'Watchlist',
    icon: 'favorite',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'person',
  },
];

export const UserNavigation: React.FC<UserNavigationProps> = ({
  currentScreen,
  onScreenChange,
}) => {
  const { colors } = useTheme();

  const NavigationItem: React.FC<{ item: NavigationItem }> = ({ item }) => {
    const isActive = currentScreen === item.id;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: isActive ? colors.primaryContainer : 'transparent',
          borderRadius: 8,
          marginBottom: 4,
        }}
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
      </View>
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
          PlayNite
        </Typography>
        <Typography variant="bodyMedium" color="onSurfaceVariant">
          Entertainment Hub
        </Typography>
      </View>

      {/* Navigation Items */}
      <View style={{ flex: 1 }}>
        {navigationItems.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </View>

      {/* Footer */}
      <View style={{
        paddingHorizontal: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.outlineVariant,
        marginTop: 16,
      }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
          }}
        >
          <Icon name="settings" size={20} color={colors.onSurfaceVariant} />
          <Typography
            variant="bodyMedium"
            color="onSurfaceVariant"
            style={{ marginLeft: 12 }}
          >
            Settings
          </Typography>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
          }}
        >
          <Icon name="help" size={20} color={colors.onSurfaceVariant} />
          <Typography
            variant="bodyMedium"
            color="onSurfaceVariant"
            style={{ marginLeft: 12 }}
          >
            Help & Support
          </Typography>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});