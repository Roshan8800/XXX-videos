import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../utils/theme-context';
import { ELEVATION } from '../constants/theme';

export type SurfaceVariant = 'surface' | 'surfaceVariant' | 'background';
export type SurfaceElevation = 0 | 1 | 2 | 3 | 4 | 5;

interface SurfaceProps extends ViewProps {
  variant?: SurfaceVariant;
  elevation?: SurfaceElevation;
  children: React.ReactNode;
}

export const Surface: React.FC<SurfaceProps> = ({
  variant = 'surface',
  elevation = 0,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  const getSurfaceStyles = () => {
    const baseStyles = {
      borderRadius: 0,
    };

    const variantStyles = {
      surface: {
        backgroundColor: colors.surface,
      },
      surfaceVariant: {
        backgroundColor: colors.surfaceVariant,
      },
      background: {
        backgroundColor: colors.background,
      },
    };

    const elevationStyles = ELEVATION[`level${elevation}` as keyof typeof ELEVATION];

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...elevationStyles,
    };
  };

  return (
    <View style={[getSurfaceStyles(), style]} {...props}>
      {children}
    </View>
  );
};

// Convenience surface components
export const ElevatedSurface: React.FC<Omit<SurfaceProps, 'elevation'>> = (props) => (
  <Surface elevation={1} {...props} />
);

export const HighElevationSurface: React.FC<Omit<SurfaceProps, 'elevation'>> = (props) => (
  <Surface elevation={3} {...props} />
);

export const SurfaceVariant: React.FC<Omit<SurfaceProps, 'variant'>> = (props) => (
  <Surface variant="surfaceVariant" {...props} />
);

export const BackgroundSurface: React.FC<Omit<SurfaceProps, 'variant'>> = (props) => (
  <Surface variant="background" {...props} />
);