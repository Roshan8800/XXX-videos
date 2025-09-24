import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';

export type StreamStatus = 'live' | 'upcoming' | 'ended' | 'offline';

interface StreamStatusProps {
  status: StreamStatus;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const StreamStatus: React.FC<StreamStatusProps> = ({
  status,
  size = 'medium',
  showLabel = true,
}) => {
  const { colors } = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case 'live':
        return {
          icon: 'check_circle' as const,
          color: '#ff0000', // Red for live
          label: 'LIVE',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
        };
      case 'upcoming':
        return {
          icon: 'info' as const,
          color: colors.primary,
          label: 'UPCOMING',
          backgroundColor: colors.primaryContainer,
        };
      case 'ended':
        return {
          icon: 'error' as const,
          color: colors.onSurfaceVariant,
          label: 'ENDED',
          backgroundColor: colors.surfaceVariant,
        };
      case 'offline':
        return {
          icon: 'warning' as const,
          color: colors.onSurfaceVariant,
          label: 'OFFLINE',
          backgroundColor: colors.surfaceVariant,
        };
      default:
        return {
          icon: 'info' as const,
          color: colors.onSurfaceVariant,
          label: 'UNKNOWN',
          backgroundColor: colors.surfaceVariant,
        };
    }
  };

  const config = getStatusConfig();
  const iconSize = size === 'small' ? 12 : size === 'medium' ? 16 : 20;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: config.backgroundColor,
        paddingHorizontal: showLabel ? (size === 'small' ? 4 : 8) : 4,
        paddingVertical: size === 'small' ? 2 : 4,
        borderRadius: size === 'small' ? 8 : 12,
        gap: showLabel ? 4 : 0,
      }}
    >
      <Icon
        name={config.icon}
        size={iconSize}
        color={config.color}
      />
      {showLabel && (
        <Typography
          variant={size === 'small' ? 'labelSmall' : 'labelMedium'}
          color={config.color}
          style={{
            fontWeight: '600',
            letterSpacing: 0.5,
          }}
        >
          {config.label}
        </Typography>
      )}
    </View>
  );
};

// Convenience components for different statuses
export const LiveStatus: React.FC<Omit<StreamStatusProps, 'status'>> = (props) => (
  <StreamStatus status="live" {...props} />
);

export const UpcomingStatus: React.FC<Omit<StreamStatusProps, 'status'>> = (props) => (
  <StreamStatus status="upcoming" {...props} />
);

export const EndedStatus: React.FC<Omit<StreamStatusProps, 'status'>> = (props) => (
  <StreamStatus status="ended" {...props} />
);

export const OfflineStatus: React.FC<Omit<StreamStatusProps, 'status'>> = (props) => (
  <StreamStatus status="offline" {...props} />
);