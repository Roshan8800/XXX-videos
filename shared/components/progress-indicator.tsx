import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../utils/theme-context';
import { Typography } from '../utils/typography';

export type ProgressVariant = 'linear' | 'circular';
export type ProgressSize = 'small' | 'medium' | 'large';

interface ProgressIndicatorProps {
  progress: number; // 0-100
  variant?: ProgressVariant;
  size?: ProgressSize;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  strokeWidth?: number;
  style?: ViewStyle;
  animated?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  variant = 'linear',
  size = 'medium',
  showPercentage = false,
  color,
  backgroundColor,
  strokeWidth,
  style,
  animated = true,
}) => {
  const { colors } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small':
        return variant === 'circular' ? 24 : { height: 4 };
      case 'medium':
        return variant === 'circular' ? 48 : { height: 6 };
      case 'large':
        return variant === 'circular' ? 72 : { height: 8 };
      default:
        return variant === 'circular' ? 48 : { height: 6 };
    }
  };

  const getStrokeWidth = () => {
    if (strokeWidth) return strokeWidth;
    switch (size) {
      case 'small':
        return 2;
      case 'medium':
        return 3;
      case 'large':
        return 4;
      default:
        return 3;
    }
  };

  const progressColor = color || colors.primary;
  const bgColor = backgroundColor || colors.surfaceVariant;

  if (variant === 'circular') {
    const sizeValue = getSize() as number;
    const stroke = getStrokeWidth();
    const radius = (sizeValue - stroke * 2) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={[{ width: sizeValue, height: sizeValue, position: 'relative' }, style]}>
        {/* Background circle */}
        <View
          style={{
            width: sizeValue,
            height: sizeValue,
            borderRadius: sizeValue / 2,
            backgroundColor: bgColor,
            position: 'absolute',
          }}
        />

        {/* Progress circle */}
        <View
          style={{
            width: sizeValue,
            height: sizeValue,
            borderRadius: sizeValue / 2,
            backgroundColor: 'transparent',
            borderWidth: stroke,
            borderColor: progressColor,
            borderStyle: 'solid',
            transform: [{ rotate: '-90deg' }],
            position: 'absolute',
          }}
        />

        {/* Percentage text */}
        {showPercentage && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant={size === 'small' ? 'labelSmall' : 'bodyLarge'}
              color="onSurface"
              style={{ fontWeight: '600' }}
            >
              {Math.round(progress)}%
            </Typography>
          </View>
        )}
      </View>
    );
  }

  // Linear progress
  const height = (getSize() as { height: number }).height;
  const progressWidth = `${Math.max(0, Math.min(100, progress))}%`;

  return (
    <View style={[{ width: '100%', position: 'relative' }, style]}>
      <View
        style={{
          width: '100%',
          height,
          backgroundColor: bgColor,
          borderRadius: height / 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <View
          style={{
            width: progressWidth as any,
            height: '100%',
            backgroundColor: progressColor,
            borderRadius: height / 2,
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
      </View>

      {showPercentage && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: -20,
            backgroundColor: colors.surface,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
            minWidth: 35,
            alignItems: 'center',
          }}
        >
          <Typography
            variant="labelSmall"
            color="onSurface"
            style={{ fontWeight: '600' }}
          >
            {Math.round(progress)}%
          </Typography>
        </View>
      )}
    </View>
  );
};

// Convenience components for common use cases
export const LinearProgress: React.FC<Omit<ProgressIndicatorProps, 'variant'>> = (props) => (
  <ProgressIndicator variant="linear" {...props} />
);

export const CircularProgress: React.FC<Omit<ProgressIndicatorProps, 'variant'>> = (props) => (
  <ProgressIndicator variant="circular" {...props} />
);

export const WatchProgress: React.FC<Omit<ProgressIndicatorProps, 'variant' | 'color'>> = (props) => (
  <ProgressIndicator variant="linear" color="#4CAF50" {...props} />
);

export const DownloadProgress: React.FC<Omit<ProgressIndicatorProps, 'variant' | 'color'>> = (props) => (
  <ProgressIndicator variant="linear" color="#2196F3" {...props} />
);