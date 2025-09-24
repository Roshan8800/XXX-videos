import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';
import { Surface } from '../../shared/components';
import { ELEVATION } from '../../shared/constants/theme';
import { WatchlistItem, WatchlistType } from '../types/watchlist';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface WatchlistActionsProps {
  item: WatchlistItem;
  onAction: (action: string, item: WatchlistItem) => void;
  variant?: 'buttons' | 'menu' | 'floating';
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  maxActions?: number;
  style?: ViewStyle;
}

export const WatchlistActions: React.FC<WatchlistActionsProps> = ({
  item,
  onAction,
  variant = 'buttons',
  size = 'medium',
  showLabels = false,
  maxActions = 4,
  style,
}) => {
  const { colors } = useTheme();

  const getDefaultActions = (): QuickAction[] => [
    {
      id: 'play',
      label: 'Play',
      icon: 'play_circle',
      color: colors.primary,
      variant: 'primary',
    },
    {
      id: 'favorite',
      label: item.lists.includes('favorites') ? 'Remove from Favorites' : 'Add to Favorites',
      icon: 'favorite',
      color: item.lists.includes('favorites') ? colors.error : colors.primary,
      variant: item.lists.includes('favorites') ? 'danger' : 'secondary',
    },
    {
      id: 'download',
      label: item.downloadStatus === 'downloaded' ? 'Downloaded' : 'Download',
      icon: 'download',
      color: item.downloadStatus === 'downloaded' ? colors.primary : colors.onSurface,
      variant: 'secondary',
    },
    {
      id: 'share',
      label: 'Share',
      icon: 'share',
      color: colors.onSurface,
      variant: 'secondary',
    },
    {
      id: 'add_to_list',
      label: 'Add to List',
      icon: 'add',
      color: colors.onSurface,
      variant: 'secondary',
    },
    {
      id: 'remove',
      label: 'Remove',
      icon: 'delete',
      color: colors.error,
      variant: 'danger',
    },
  ];

  const actions = getDefaultActions().slice(0, maxActions);

  const getActionStyles = (action: QuickAction): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      padding: size === 'small' ? 8 : size === 'large' ? 16 : 12,
    };

    const sizeStyles = {
      small: { minWidth: 32, minHeight: 32 },
      medium: { minWidth: 40, minHeight: 40 },
      large: { minWidth: 48, minHeight: 48 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: action.color || colors.primary,
      },
      secondary: {
        backgroundColor: colors.surfaceVariant,
        borderWidth: 1,
        borderColor: colors.outline,
      },
      danger: {
        backgroundColor: colors.errorContainer,
        borderWidth: 1,
        borderColor: colors.error,
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[action.variant || 'secondary'],
    };
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const getTextColor = (action: QuickAction) => {
    switch (action.variant) {
      case 'primary':
        return colors.onPrimary;
      case 'danger':
        return colors.onErrorContainer;
      default:
        return colors.onSurfaceVariant;
    }
  };

  const handleActionPress = (action: QuickAction) => {
    onAction(action.id, item);
  };

  if (variant === 'floating') {
    return (
      <View
        style={[
          {
            position: 'absolute',
            right: 16,
            bottom: 16,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 4,
            ...ELEVATION.level2,
          },
          style,
        ]}
      >
        <TouchableOpacity
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => handleActionPress(actions[0])}
        >
          <Icon
            name={actions[0].icon as any}
            size={24}
            color={colors.onPrimary}
          />
        </TouchableOpacity>
      </View>
    );
  }

  if (variant === 'menu') {
    return (
      <Surface
        style={[
          {
            borderRadius: 8,
            padding: 8,
            marginTop: 8,
            ...ELEVATION.level1,
          },
          style,
        ]}
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              marginBottom: 4,
            }}
            onPress={() => handleActionPress(action)}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: action.color || colors.surfaceVariant,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Icon
                name={action.icon as any}
                size={16}
                color={action.variant === 'primary' ? colors.onPrimary : colors.onSurfaceVariant}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Typography
                variant="bodyMedium"
                color="onSurface"
              >
                {action.label}
              </Typography>
            </View>

            <Icon
              name="chevron_right"
              size={20}
              color={colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        ))}
      </Surface>
    );
  }

  // Default buttons variant
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          gap: 8,
          flexWrap: 'wrap',
        },
        style,
      ]}
    >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={getActionStyles(action)}
          onPress={() => handleActionPress(action)}
          disabled={action.id === 'download' && item.downloadStatus === 'downloaded'}
        >
          <Icon
            name={action.icon as any}
            size={getIconSize()}
            color={getTextColor(action)}
          />
          {showLabels && (
            <Typography
              variant="labelSmall"
              color={getTextColor(action)}
              style={{
                marginTop: 4,
                fontSize: size === 'small' ? 10 : 12,
                textAlign: 'center',
              }}
            >
              {action.label}
            </Typography>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Specialized action components
export const QuickPlayButton: React.FC<{
  item: WatchlistItem;
  onPlay: (item: WatchlistItem) => void;
  style?: ViewStyle;
}> = ({ item, onPlay, style }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: colors.primary,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 24,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          ...ELEVATION.level1,
        },
        style,
      ]}
      onPress={() => onPlay(item)}
    >
      <Icon name="play_circle" size={20} color={colors.onPrimary} />
      <Typography variant="labelLarge" color="onPrimary">
        Play Now
      </Typography>
    </TouchableOpacity>
  );
};

export const FavoriteToggle: React.FC<{
  item: WatchlistItem;
  onToggle: (item: WatchlistItem) => void;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}> = ({ item, onToggle, size = 'medium', style }) => {
  const { colors } = useTheme();

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const isFavorite = item.lists.includes('favorites');

  return (
    <TouchableOpacity
      style={[
        {
          padding: size === 'small' ? 8 : size === 'large' ? 16 : 12,
          borderRadius: 20,
          backgroundColor: isFavorite ? colors.secondaryContainer : colors.surfaceVariant,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      onPress={() => onToggle(item)}
    >
      <Icon
        name="favorite"
        size={iconSize}
        color={isFavorite ? colors.onSecondaryContainer : colors.onSurfaceVariant}
      />
    </TouchableOpacity>
  );
};

export const DownloadButton: React.FC<{
  item: WatchlistItem;
  onDownload: (item: WatchlistItem) => void;
  style?: ViewStyle;
}> = ({ item, onDownload, style }) => {
  const { colors } = useTheme();

  const getIcon = () => {
    switch (item.downloadStatus) {
      case 'downloaded':
        return 'check_circle';
      case 'downloading':
        return 'download';
      case 'error':
        return 'error';
      default:
        return 'download';
    }
  };

  const getColor = () => {
    switch (item.downloadStatus) {
      case 'downloaded':
        return colors.primary;
      case 'error':
        return colors.error;
      default:
        return colors.onSurfaceVariant;
    }
  };

  const getBackgroundColor = () => {
    switch (item.downloadStatus) {
      case 'downloaded':
        return colors.primaryContainer;
      case 'error':
        return colors.errorContainer;
      default:
        return colors.surfaceVariant;
    }
  };

  return (
    <TouchableOpacity
      style={[
        {
          padding: 12,
          borderRadius: 20,
          backgroundColor: getBackgroundColor(),
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      onPress={() => onDownload(item)}
      disabled={item.downloadStatus === 'downloaded'}
    >
      <Icon
        name={getIcon() as any}
        size={20}
        color={getColor()}
      />
    </TouchableOpacity>
  );
};