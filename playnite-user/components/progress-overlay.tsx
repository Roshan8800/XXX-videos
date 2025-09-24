import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';

interface ProgressOverlayProps {
  progress: number; // 0-100
  duration?: string;
  timeRemaining?: string;
  showProgressBar?: boolean;
  showDuration?: boolean;
  showTimeRemaining?: boolean;
  showPercentage?: boolean;
  isAvailableOffline?: boolean;
  isMature?: boolean;
  size?: 'small' | 'medium' | 'large';
  position?: 'bottom' | 'top' | 'center';
  style?: ViewStyle;
}

export const ProgressOverlay: React.FC<ProgressOverlayProps> = ({
  progress,
  duration,
  timeRemaining,
  showProgressBar = true,
  showDuration = true,
  showTimeRemaining = true,
  showPercentage = true,
  isAvailableOffline = false,
  isMature = false,
  size = 'medium',
  position = 'bottom',
  style,
}) => {
  const { colors } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: 4,
          borderRadius: 4,
          iconSize: 12,
          textSize: 'bodySmall' as const,
        };
      case 'large':
        return {
          padding: 12,
          borderRadius: 8,
          iconSize: 20,
          textSize: 'bodyLarge' as const,
        };
      default:
        return {
          padding: 8,
          borderRadius: 6,
          iconSize: 16,
          textSize: 'bodyMedium' as const,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getPositionStyles = (): ViewStyle => {
    switch (position) {
      case 'top':
        return {
          top: 8,
          left: 8,
          right: 8,
          alignItems: 'flex-start',
        };
      case 'center':
        return {
          top: '50%',
          left: '50%',
          transform: [{ translateX: -50 }, { translateY: -50 }],
          alignItems: 'center',
          justifyContent: 'center',
        };
      default:
        return {
          bottom: 8,
          left: 8,
          right: 8,
          alignItems: 'flex-start',
        };
    }
  };

  const renderProgressBar = () => {
    if (!showProgressBar) return null;

    return (
      <View style={{
        width: '100%',
        height: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 1.5,
        marginTop: 4,
      }}>
        <View style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: colors.primary,
          borderRadius: 1.5,
        }} />
      </View>
    );
  };

  const renderDurationBadge = () => {
    if (!showDuration || !duration) return null;

    return (
      <View style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: sizeStyles.padding,
        paddingVertical: sizeStyles.padding / 2,
        borderRadius: sizeStyles.borderRadius,
        marginRight: 8,
      }}>
        <Typography variant={sizeStyles.textSize} color="onPrimary">
          {duration}
        </Typography>
      </View>
    );
  };

  const renderTimeRemaining = () => {
    if (!showTimeRemaining || !timeRemaining) return null;

    return (
      <View style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: sizeStyles.padding,
        paddingVertical: sizeStyles.padding / 2,
        borderRadius: sizeStyles.borderRadius,
        marginRight: 8,
      }}>
        <Typography variant={sizeStyles.textSize} color="onPrimary">
          {timeRemaining} left
        </Typography>
      </View>
    );
  };

  const renderPercentage = () => {
    if (!showPercentage) return null;

    return (
      <View style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: sizeStyles.padding,
        paddingVertical: sizeStyles.padding / 2,
        borderRadius: sizeStyles.borderRadius,
      }}>
        <Typography variant={sizeStyles.textSize} color="onPrimary">
          {progress}%
        </Typography>
      </View>
    );
  };

  const renderOfflineIndicator = () => {
    if (!isAvailableOffline) return null;

    return (
      <View style={{
        position: 'absolute',
        top: 4,
        left: 4,
        backgroundColor: colors.primary,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
      }}>
        <Icon name="download" size={sizeStyles.iconSize} color="white" />
      </View>
    );
  };

  const renderMatureIndicator = () => {
    if (!isMature) return null;

    const leftOffset = isAvailableOffline ? 32 : 4;

    return (
      <View style={{
        position: 'absolute',
        top: 4,
        left: leftOffset,
        backgroundColor: colors.error,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
      }}>
        <Typography variant="bodySmall" color="onError">
          18+
        </Typography>
      </View>
    );
  };

  return (
    <View style={[{
      position: 'absolute',
      ...getPositionStyles(),
    }, style]}>
      {/* Top Indicators */}
      {position === 'top' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          {renderDurationBadge()}
          {renderTimeRemaining()}
          {renderPercentage()}
        </View>
      )}

      {/* Center Play Button */}
      {position === 'center' && (
        <View style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <Icon name="play_arrow" size={32} color="white" />
        </View>
      )}

      {/* Bottom Indicators */}
      {position === 'bottom' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          {renderDurationBadge()}
          {renderTimeRemaining()}
          {renderPercentage()}
        </View>
      )}

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Top Right Indicators */}
      {renderOfflineIndicator()}
      {renderMatureIndicator()}
    </View>
  );
};

// Convenience components for common use cases
export const ThumbnailProgressOverlay: React.FC<Omit<ProgressOverlayProps, 'position' | 'size'>> = (props) => (
  <ProgressOverlay position="bottom" size="small" {...props} />
);

export const CardProgressOverlay: React.FC<Omit<ProgressOverlayProps, 'position' | 'size'>> = (props) => (
  <ProgressOverlay position="bottom" size="medium" {...props} />
);

export const FullscreenProgressOverlay: React.FC<Omit<ProgressOverlayProps, 'position' | 'size'>> = (props) => (
  <ProgressOverlay position="center" size="large" {...props} />
);