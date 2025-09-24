import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from './theme-context';
import { TYPOGRAPHY } from '../constants/theme';

export type TypographyVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall';

interface TypographyProps extends TextProps {
  variant: TypographyVariant;
  color?: 'primary' | 'onPrimary' | 'onBackground' | 'onSurface' | 'onSurfaceVariant' | 'error' | string;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'black';
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  color,
  align = 'left',
  weight,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  const variantStyles = TYPOGRAPHY[variant];

  const getColor = () => {
    if (color && colors[color as keyof typeof colors]) {
      return colors[color as keyof typeof colors];
    }
    switch (color) {
      case 'primary':
        return colors.primary;
      case 'onPrimary':
        return colors.onPrimary;
      case 'onBackground':
        return colors.onBackground;
      case 'onSurface':
        return colors.onSurface;
      case 'onSurfaceVariant':
        return colors.onSurfaceVariant;
      case 'error':
        return colors.error;
      default:
        return colors.onSurface;
    }
  };

  const getFontWeight = () => {
    if (weight) {
      switch (weight) {
        case 'light':
          return TYPOGRAPHY.light;
        case 'regular':
          return TYPOGRAPHY.regular;
        case 'medium':
          return TYPOGRAPHY.medium;
        case 'semibold':
          return TYPOGRAPHY.semibold;
        case 'bold':
          return TYPOGRAPHY.bold;
        case 'black':
          return TYPOGRAPHY.black;
        default:
          return variantStyles.fontWeight;
      }
    }
    return variantStyles.fontWeight;
  };

  return (
    <Text
      style={[
        {
          fontFamily: TYPOGRAPHY.display,
          fontSize: variantStyles.fontSize,
          lineHeight: variantStyles.lineHeight,
          fontWeight: getFontWeight(),
          color: getColor(),
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Convenience components for common typography variants
export const DisplayLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="displayLarge" {...props} />
);

export const DisplayMedium: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="displayMedium" {...props} />
);

export const DisplaySmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="displaySmall" {...props} />
);

export const HeadlineLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="headlineLarge" {...props} />
);

export const HeadlineMedium: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="headlineMedium" {...props} />
);

export const HeadlineSmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="headlineSmall" {...props} />
);

export const TitleLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="titleLarge" {...props} />
);

export const TitleMedium: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="titleMedium" {...props} />
);

export const TitleSmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="titleSmall" {...props} />
);

export const LabelLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelLarge" {...props} />
);

export const LabelMedium: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelMedium" {...props} />
);

export const LabelSmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelSmall" {...props} />
);

export const BodyLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyLarge" {...props} />
);

export const BodyMedium: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyMedium" {...props} />
);

export const BodySmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodySmall" {...props} />
);