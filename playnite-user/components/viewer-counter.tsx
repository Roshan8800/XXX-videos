import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';

interface ViewerCounterProps {
  viewerCount: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  animated?: boolean;
}

export const ViewerCounter: React.FC<ViewerCounterProps> = ({
  viewerCount,
  size = 'medium',
  showLabel = true,
  animated = false,
}) => {
  const { colors } = useTheme();

  const formatViewerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 6,
          paddingVertical: 2,
          iconSize: 12,
          typographyVariant: 'labelSmall' as const,
        };
      case 'large':
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          iconSize: 20,
          typographyVariant: 'labelLarge' as const,
        };
      default: // medium
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          iconSize: 16,
          typographyVariant: 'labelMedium' as const,
        };
    }
  };

  const styles = getSizeStyles();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: styles.paddingHorizontal,
        paddingVertical: styles.paddingVertical,
        borderRadius: 16,
        gap: showLabel ? 4 : 0,
      }}
    >
      <Icon
        name="visibility"
        size={styles.iconSize}
        color="white"
      />
      {showLabel && (
        <Typography
          variant={styles.typographyVariant}
          color="onPrimary"
          style={{
            fontWeight: '600',
          }}
        >
          {formatViewerCount(viewerCount)}
        </Typography>
      )}
    </View>
  );
};

// Convenience components for different sizes
export const SmallViewerCounter: React.FC<Omit<ViewerCounterProps, 'size'>> = (props) => (
  <ViewerCounter size="small" {...props} />
);

export const MediumViewerCounter: React.FC<Omit<ViewerCounterProps, 'size'>> = (props) => (
  <ViewerCounter size="medium" {...props} />
);

export const LargeViewerCounter: React.FC<Omit<ViewerCounterProps, 'size'>> = (props) => (
  <ViewerCounter size="large" {...props} />
);