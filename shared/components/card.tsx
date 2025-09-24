import React from 'react';
import { View, ViewProps, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../utils/theme-context';
import { ELEVATION } from '../constants/theme';

export type CardVariant = 'filled' | 'outlined' | 'elevated';
export type CardSize = 'small' | 'medium' | 'large';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  size?: CardSize;
  clickable?: boolean;
  children: React.ReactNode;
}

interface ClickableCardProps extends TouchableOpacityProps {
  variant?: CardVariant;
  size?: CardSize;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'filled',
  size = 'medium',
  clickable = false,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: 12,
      padding: 16,
    };

    const sizeStyles = {
      small: { padding: 12 },
      medium: { padding: 16 },
      large: { padding: 24 },
    };

    const variantStyles = {
      filled: {
        backgroundColor: colors.surface,
      },
      outlined: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
      },
      elevated: {
        backgroundColor: colors.surface,
        ...ELEVATION.level1,
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  if (clickable) {
    return (
      <TouchableOpacity
        style={[getCardStyles(), style]}
        activeOpacity={0.8}
        {...(props as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyles(), style]} {...props}>
      {children}
    </View>
  );
};

export const ClickableCard: React.FC<ClickableCardProps> = ({
  variant = 'filled',
  size = 'medium',
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  const getCardStyles = () => {
    const baseStyles = {
      borderRadius: 12,
      padding: 16,
    };

    const sizeStyles = {
      small: { padding: 12 },
      medium: { padding: 16 },
      large: { padding: 24 },
    };

    const variantStyles = {
      filled: {
        backgroundColor: colors.surface,
      },
      outlined: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
      },
      elevated: {
        backgroundColor: colors.surface,
        ...ELEVATION.level1,
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getCardStyles(), style]}
      activeOpacity={0.8}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

// Convenience card components
export const FilledCard: React.FC<CardProps> = (props) => (
  <Card variant="filled" {...props} />
);

export const OutlinedCard: React.FC<CardProps> = (props) => (
  <Card variant="outlined" {...props} />
);

export const ElevatedCard: React.FC<CardProps> = (props) => (
  <Card variant="elevated" {...props} />
);