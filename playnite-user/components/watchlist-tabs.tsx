import React from 'react';
import { View, ScrollView, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';
import { Surface } from '../../shared/components';
import { WatchlistType, WatchlistList } from '../types/watchlist';

interface WatchlistTab {
  id: WatchlistType;
  label: string;
  icon: string;
  badge?: number;
  color?: string;
}

interface WatchlistTabsProps {
  tabs: WatchlistTab[];
  activeTab: WatchlistType;
  onTabChange: (tabId: WatchlistType) => void;
  variant?: 'default' | 'pills' | 'underline';
  scrollable?: boolean;
  style?: ViewStyle;
}

export const WatchlistTabs: React.FC<WatchlistTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  scrollable = false,
  style,
}) => {
  const { colors } = useTheme();

  const getTabStyles = (isActive: boolean, tabColor?: string) => {
    const baseStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      marginRight: 8,
      minWidth: 80,
    };

    switch (variant) {
      case 'pills':
        return {
          ...baseStyles,
          backgroundColor: isActive ? (tabColor || colors.primary) : colors.surfaceVariant,
          borderRadius: 20,
        };
      case 'underline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderBottomWidth: isActive ? 2 : 0,
          borderBottomColor: isActive ? (tabColor || colors.primary) : 'transparent',
          borderRadius: 0,
          paddingVertical: 16,
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: isActive ? (tabColor || colors.primaryContainer) : 'transparent',
          borderWidth: isActive ? 0 : 1,
          borderColor: colors.outlineVariant,
        };
    }
  };

  const getTextColor = (isActive: boolean, tabColor?: string) => {
    if (variant === 'pills') {
      return isActive ? colors.onPrimary : colors.onSurfaceVariant;
    }
    return isActive ? (tabColor ? colors.onPrimary : colors.onPrimaryContainer) : colors.onSurfaceVariant;
  };

  const getIconColor = (isActive: boolean, tabColor?: string) => {
    if (variant === 'pills') {
      return isActive ? colors.onPrimary : colors.onSurfaceVariant;
    }
    return isActive ? (tabColor ? colors.onPrimary : colors.onPrimaryContainer) : colors.onSurfaceVariant;
  };

  const TabContent = ({ tab, isActive }: { tab: WatchlistTab; isActive: boolean }) => (
    <TouchableOpacity
      style={getTabStyles(isActive, tab.color)}
      onPress={() => onTabChange(tab.id)}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon
          name={tab.icon as any}
          size={18}
          color={getIconColor(isActive, tab.color)}
        />
        <Typography
          variant="labelLarge"
          color={getTextColor(isActive, tab.color)}
          style={{ fontWeight: isActive ? '600' : '500' }}
        >
          {tab.label}
        </Typography>
        {tab.badge !== undefined && tab.badge > 0 && (
          <View
            style={{
              backgroundColor: isActive ? colors.primary : colors.error,
              borderRadius: 10,
              minWidth: 18,
              height: 18,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
            }}
          >
            <Typography
              variant="labelSmall"
              color={isActive ? 'onPrimary' : 'onError'}
              style={{ fontSize: 10 }}
            >
              {tab.badge > 99 ? '99+' : tab.badge}
            </Typography>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (scrollable) {
    return (
      <Surface style={[{ paddingVertical: 8 }, style]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {tabs.map((tab) => (
            <TabContent
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
            />
          ))}
        </ScrollView>
      </Surface>
    );
  }

  return (
    <Surface style={[{ paddingVertical: 8 }, style]}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
        {tabs.map((tab) => (
          <TabContent
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
          />
        ))}
      </View>
    </Surface>
  );
};

// Predefined tab configurations
export const getDefaultWatchlistTabs = (itemCounts?: Record<WatchlistType, number>): WatchlistTab[] => [
  {
    id: 'watchlist',
    label: 'Watchlist',
    icon: 'playlist_add_check',
    badge: itemCounts?.watchlist || 0,
    color: '#2196F3',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: 'favorite',
    badge: itemCounts?.favorites || 0,
    color: '#E91E63',
  },
  {
    id: 'watched',
    label: 'Watched',
    icon: 'visibility',
    badge: itemCounts?.watched || 0,
    color: '#4CAF50',
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: 'folder',
    badge: itemCounts?.custom || 0,
    color: '#FF9800',
  },
];

export const getCompactWatchlistTabs = (itemCounts?: Record<WatchlistType, number>): WatchlistTab[] => [
  {
    id: 'watchlist',
    label: 'Watch',
    icon: 'playlist_add_check',
    badge: itemCounts?.watchlist || 0,
    color: '#2196F3',
  },
  {
    id: 'favorites',
    label: 'Fav',
    icon: 'favorite',
    badge: itemCounts?.favorites || 0,
    color: '#E91E63',
  },
  {
    id: 'watched',
    label: 'Done',
    icon: 'visibility',
    badge: itemCounts?.watched || 0,
    color: '#4CAF50',
  },
  {
    id: 'custom',
    label: 'More',
    icon: 'folder',
    badge: itemCounts?.custom || 0,
    color: '#FF9800',
  },
];