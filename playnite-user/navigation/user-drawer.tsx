import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';
import { Surface } from '../../shared/components';
import { useNavigation } from '../../shared/utils/navigation-context';

interface DrawerItem {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
  badge?: number;
}

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const { navigateToAuth } = useNavigation();

  const drawerItems: DrawerItem[] = [
    {
      id: 'premium-content',
      label: 'Premium Content',
      icon: 'star',
      onPress: () => console.log('Navigate to premium content'),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'notifications',
      onPress: () => console.log('Navigate to notifications'),
      badge: 3,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      onPress: () => console.log('Navigate to settings'),
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: 'recommendations',
      onPress: () => console.log('Navigate to recommendations'),
    },
    {
      id: 'watchlist',
      label: 'My Watchlist',
      icon: 'favorite',
      onPress: () => console.log('Navigate to watchlist'),
    },
    {
      id: 'downloads',
      label: 'Downloads',
      icon: 'download',
      onPress: () => {
        console.log('Navigate to downloads');
        // TODO: Implement navigation to downloads screen
      },
    },
    {
      id: 'history',
      label: 'Watch History',
      icon: 'history',
      onPress: () => console.log('Navigate to history'),
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'help',
      onPress: () => console.log('Navigate to help'),
    },
    {
      id: 'about',
      label: 'About PlayNite',
      icon: 'info',
      onPress: () => console.log('Navigate to about'),
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
        accessible={true}
        accessibilityLabel="Close drawer"
        accessibilityHint="Tap to close the navigation drawer"
        accessibilityRole="button"
      />

      {/* Drawer */}
      <View style={[styles.drawer, { backgroundColor: colors.surface }]}>
        <Surface style={styles.drawerContent}>
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="headlineSmall" color="onSurface">
              PlayNite
            </Typography>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              Entertainment Hub
            </Typography>
          </View>

          {/* Navigation Items */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {drawerItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.drawerItem}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
                accessible={true}
                accessibilityLabel={item.label}
                accessibilityHint={`Navigate to ${item.label}`}
                accessibilityRole="button"
              >
                <View style={styles.drawerItemContent}>
                  <View style={styles.drawerItemLeft}>
                    <Icon
                      name={item.icon as any}
                      size={24}
                      color={colors.onSurfaceVariant}
                    />
                    <Typography
                      variant="bodyLarge"
                      color="onSurfaceVariant"
                      style={styles.drawerItemLabel}
                    >
                      {item.label}
                    </Typography>
                  </View>

                  {item.badge && item.badge > 0 && (
                    <View style={[styles.badge, { backgroundColor: colors.error }]}>
                      <Typography variant="labelSmall" color="onError">
                        {item.badge}
                      </Typography>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                navigateToAuth();
                onClose();
              }}
              accessible={true}
              accessibilityLabel="Sign Out"
              accessibilityHint="Sign out of your account"
              accessibilityRole="button"
            >
              <Icon name="close" size={20} color={colors.error} />
              <Typography variant="bodyMedium" color="error" style={styles.logoutText}>
                Sign Out
              </Typography>
            </TouchableOpacity>
          </View>
        </Surface>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: Math.min(300, 280), // Responsive width, max 280px
    zIndex: 1001,
  },
  drawerContent: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  drawerItem: {
    marginBottom: 4,
  },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  drawerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemLabel: {
    marginLeft: 12,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    marginLeft: 12,
  },
});