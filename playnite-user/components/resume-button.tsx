import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';

interface ResumeButtonProps {
  onPress: () => void;
  progress?: number; // 0-100
  timeRemaining?: string;
  isLoading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'floating';
  showProgress?: boolean;
  showTimeRemaining?: boolean;
  style?: ViewStyle;
}

export const ResumeButton: React.FC<ResumeButtonProps> = ({
  onPress,
  progress,
  timeRemaining,
  isLoading = false,
  disabled = false,
  size = 'medium',
  variant = 'primary',
  showProgress = true,
  showTimeRemaining = true,
  style,
}) => {
  const { colors } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 40,
          height: 40,
          borderRadius: 20,
          iconSize: 20,
          padding: 8,
        };
      case 'large':
        return {
          width: 64,
          height: 64,
          borderRadius: 32,
          iconSize: 32,
          padding: 16,
        };
      default:
        return {
          width: 48,
          height: 48,
          borderRadius: 24,
          iconSize: 24,
          padding: 12,
        };
    }
  };

  const getVariantStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      ...getSizeStyles(),
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: colors.surface,
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'floating':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4,
        };
      default:
        return baseStyles;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return 'white';
      case 'secondary':
        return colors.primary;
      case 'floating':
        return 'white';
      default:
        return 'white';
    }
  };

  const sizeStyles = getSizeStyles();

  const handlePress = () => {
    if (!disabled && !isLoading) {
      onPress();
    }
  };

  const renderProgressIndicator = () => {
    if (!showProgress || progress === undefined) return null;

    return (
      <View style={{
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        borderRadius: sizeStyles.borderRadius + 4,
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
      }} />
    );
  };

  const renderTimeRemaining = () => {
    if (!showTimeRemaining || !timeRemaining) return null;

    return (
      <View style={{
        position: 'absolute',
        top: -32,
        left: '50%',
        transform: [{ translateX: -50 }],
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        minWidth: 80,
        alignItems: 'center',
      }}>
        <Typography variant="bodySmall" color="onPrimary">
          {timeRemaining} left
        </Typography>
      </View>
    );
  };

  const renderLoadingSpinner = () => {
    if (!isLoading) return null;

    return (
      <View style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -10 }, { translateY: -10 }],
      }}>
        <View style={{
          width: 20,
          height: 20,
          borderWidth: 2,
          borderColor: getIconColor(),
          borderTopColor: 'transparent',
          borderRadius: 10,
          transform: [{ rotate: '0deg' }],
        }} />
      </View>
    );
  };

  return (
    <View style={style}>
      {renderTimeRemaining()}

      <TouchableOpacity
        style={getVariantStyles()}
        onPress={handlePress}
        disabled={disabled || isLoading}
        activeOpacity={0.8}
      >
        {renderProgressIndicator()}

        <Icon
          name="play_arrow"
          size={sizeStyles.iconSize}
          color={getIconColor()}
        />

        {renderLoadingSpinner()}
      </TouchableOpacity>
    </View>
  );
};

// Convenience components for common use cases
export const PrimaryResumeButton: React.FC<Omit<ResumeButtonProps, 'variant'>> = (props) => (
  <ResumeButton variant="primary" {...props} />
);

export const SecondaryResumeButton: React.FC<Omit<ResumeButtonProps, 'variant'>> = (props) => (
  <ResumeButton variant="secondary" {...props} />
);

export const FloatingResumeButton: React.FC<Omit<ResumeButtonProps, 'variant'>> = (props) => (
  <ResumeButton variant="floating" {...props} />
);

// Compact version for cards
export const CompactResumeButton: React.FC<Omit<ResumeButtonProps, 'size' | 'showProgress' | 'showTimeRemaining'>> = (props) => (
  <ResumeButton size="small" showProgress={false} showTimeRemaining={false} {...props} />
);

// Full featured version for detailed views
export const DetailedResumeButton: React.FC<Omit<ResumeButtonProps, 'size' | 'showProgress' | 'showTimeRemaining'>> = (props) => (
  <ResumeButton size="large" showProgress={true} showTimeRemaining={true} {...props} />
);