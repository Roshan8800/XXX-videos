import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../utils/theme-context';
import { Typography } from '../utils/typography';
import { Icon, IconName } from '../utils/icons';

export type ButtonVariant =
  | 'filled'
  | 'outlined'
  | 'text'
  | 'elevated'
  | 'tonal';

export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    };

    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 32,
      },
      medium: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        minHeight: 40,
      },
      large: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        minHeight: 48,
      },
    };

    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      filled: {
        backgroundColor: colors.primary,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.outline,
      },
      text: {
        backgroundColor: 'transparent',
      },
      elevated: {
        backgroundColor: colors.surface,
        shadowColor: colors.onSurface,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      tonal: {
        backgroundColor: colors.secondaryContainer,
      },
    };

    const disabledStyles: ViewStyle = disabled ? {
      opacity: 0.5,
    } : {};

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyles,
      ...(fullWidth && { width: '100%' }),
    };
  };

  const getTextColor = () => {
    if (disabled) return colors.onSurface;

    switch (variant) {
      case 'filled':
        return colors.onPrimary;
      case 'outlined':
      case 'text':
        return colors.primary;
      case 'elevated':
        return colors.primary;
      case 'tonal':
        return colors.onSecondaryContainer;
      default:
        return colors.onSurface;
    }
  };

  const getIconColor = () => {
    if (disabled) return colors.onSurface;

    switch (variant) {
      case 'filled':
        return colors.onPrimary;
      case 'outlined':
      case 'text':
        return colors.primary;
      case 'elevated':
        return colors.primary;
      case 'tonal':
        return colors.onSecondaryContainer;
      default:
        return colors.onSurface;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 18;
      case 'large':
        return 20;
      default:
        return 18;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getIconColor()}
        />
      ) : (
        <>
          {leftIcon && (
            <Icon
              name={leftIcon}
              size={getIconSize()}
              color={getIconColor()}
            />
          )}

          <Typography
            variant={size === 'small' ? 'labelLarge' : 'labelLarge'}
            color={getTextColor()}
          >
            {children}
          </Typography>

          {rightIcon && (
            <Icon
              name={rightIcon}
              size={getIconSize()}
              color={getIconColor()}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

// Convenience button components
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="filled" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="outlined" {...props} />
);

export const TextButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="text" {...props} />
);

export const ElevatedButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="elevated" {...props} />
);

export const TonalButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="tonal" {...props} />
);