import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../utils/theme-context';
import { Typography } from '../utils/typography';

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  showText?: boolean;
  text?: string;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 64,
  strokeWidth = 4,
  showPercentage = true,
  showText = false,
  text,
  color,
  backgroundColor,
  style,
  children,
}) => {
  const { colors } = useTheme();

  const progressColor = color || colors.primary;
  const bgColor = backgroundColor || colors.surfaceVariant;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const renderProgressRing = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: bgColor,
          backgroundColor: 'transparent',
        }}
      >
        {/* Progress Arc - simplified as a colored border */}
        <View
          style={{
            position: 'absolute',
            top: strokeWidth / 2,
            left: strokeWidth / 2,
            width: size - strokeWidth,
            height: size - strokeWidth,
            borderRadius: (size - strokeWidth) / 2,
            borderWidth: strokeWidth,
            borderColor: progressColor,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            // Note: For a true circular progress, you would need a more complex implementation
            // This is a simplified version that shows progress as a colored ring
          }}
        />
      </View>
    );
  };

  const renderCenterContent = () => {
    if (children) {
      return children;
    }

    if (showText && text) {
      return (
        <Typography variant="bodyMedium" color="onSurface" style={{ textAlign: 'center' }}>
          {text}
        </Typography>
      );
    }

    if (showPercentage) {
      return (
        <Typography variant="titleMedium" color="onSurface" style={{ fontWeight: 'bold' }}>
          {Math.round(progress)}%
        </Typography>
      );
    }

    return null;
  };

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        },
        style,
      ]}
    >
      {renderProgressRing()}
      {renderCenterContent()}
    </View>
  );
};

// Convenience components for common use cases
export const SmallCircularProgress: React.FC<Omit<CircularProgressProps, 'size'>> = (props) => (
  <CircularProgress size={32} {...props} />
);

export const MediumCircularProgress: React.FC<Omit<CircularProgressProps, 'size'>> = (props) => (
  <CircularProgress size={64} {...props} />
);

export const LargeCircularProgress: React.FC<Omit<CircularProgressProps, 'size'>> = (props) => (
  <CircularProgress size={96} {...props} />
);

export const XLargeCircularProgress: React.FC<Omit<CircularProgressProps, 'size'>> = (props) => (
  <CircularProgress size={128} {...props} />
);

// Progress indicator with icon
interface CircularProgressWithIconProps extends CircularProgressProps {
  iconName: string;
  iconSize?: number;
  iconColor?: string;
}

export const CircularProgressWithIcon: React.FC<CircularProgressWithIconProps> = ({
  iconName,
  iconSize = 24,
  iconColor,
  ...progressProps
}) => {
  const { colors } = useTheme();
  const iconColorFinal = iconColor || colors.onSurface;

  return (
    <CircularProgress {...progressProps}>
      <Typography
        style={{
          fontSize: iconSize,
          color: iconColorFinal,
          fontFamily: 'Material Symbols Outlined',
        }}
      >
        {iconName}
      </Typography>
    </CircularProgress>
  );
};

// Animated progress indicator (placeholder for future animation implementation)
interface AnimatedCircularProgressProps extends CircularProgressProps {
  duration?: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

export const AnimatedCircularProgress: React.FC<AnimatedCircularProgressProps> = ({
  progress,
  duration = 1000,
  easing = 'easeOut',
  ...props
}) => {
  // For now, this is just a wrapper around CircularProgress
  // In a real implementation, you would add animation logic here
  return <CircularProgress progress={progress} {...props} />;
};