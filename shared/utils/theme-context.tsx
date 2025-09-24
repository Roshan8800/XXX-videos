import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { COLORS } from '../constants/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  // Primary colors
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  // Secondary colors
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  // Tertiary colors
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  // Error colors
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  // Background colors
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceTint: string;

  // Outline colors
  outline: string;
  outlineVariant: string;

  // Special colors
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;

  // Elevation overlays
  elevationOverlay: string;
}

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightColors: ThemeColors = {
  primary: COLORS.primary,
  onPrimary: COLORS.onPrimary,
  primaryContainer: COLORS.primaryContainer,
  onPrimaryContainer: COLORS.onPrimaryContainer,
  secondary: COLORS.secondary,
  onSecondary: COLORS.onSecondary,
  secondaryContainer: COLORS.secondaryContainer,
  onSecondaryContainer: COLORS.onSecondaryContainer,
  tertiary: COLORS.tertiary,
  onTertiary: COLORS.onTertiary,
  tertiaryContainer: COLORS.tertiaryContainer,
  onTertiaryContainer: COLORS.onTertiaryContainer,
  error: COLORS.error,
  onError: COLORS.onError,
  errorContainer: COLORS.errorContainer,
  onErrorContainer: COLORS.onErrorContainer,
  background: COLORS.background,
  onBackground: COLORS.onBackground,
  surface: COLORS.surface,
  onSurface: COLORS.onSurface,
  surfaceVariant: COLORS.surfaceVariant,
  onSurfaceVariant: COLORS.onSurfaceVariant,
  surfaceTint: COLORS.surfaceTint,
  outline: COLORS.outline,
  outlineVariant: COLORS.outlineVariant,
  inverseSurface: COLORS.inverseSurface,
  inverseOnSurface: COLORS.inverseOnSurface,
  inversePrimary: COLORS.inversePrimary,
  elevationOverlay: COLORS.elevationOverlayLight,
};

const darkColors: ThemeColors = {
  primary: COLORS.primary,
  onPrimary: COLORS.onPrimary,
  primaryContainer: COLORS.primaryContainer,
  onPrimaryContainer: COLORS.onPrimaryContainer,
  secondary: COLORS.secondary,
  onSecondary: COLORS.onSecondary,
  secondaryContainer: COLORS.secondaryContainer,
  onSecondaryContainer: COLORS.onSecondaryContainer,
  tertiary: COLORS.tertiary,
  onTertiary: COLORS.onTertiary,
  tertiaryContainer: COLORS.tertiaryContainer,
  onTertiaryContainer: COLORS.onTertiaryContainer,
  error: COLORS.error,
  onError: COLORS.onError,
  errorContainer: COLORS.errorContainer,
  onErrorContainer: COLORS.onErrorContainer,
  background: COLORS.backgroundDark,
  onBackground: COLORS.onBackgroundDark,
  surface: COLORS.surfaceDark,
  onSurface: COLORS.onSurfaceDark,
  surfaceVariant: COLORS.surfaceVariantDark,
  onSurfaceVariant: COLORS.onSurfaceVariantDark,
  surfaceTint: COLORS.surfaceTint,
  outline: COLORS.outline,
  outlineVariant: COLORS.outlineVariant,
  inverseSurface: COLORS.inverseSurfaceDark,
  inverseOnSurface: COLORS.inverseOnSurfaceDark,
  inversePrimary: COLORS.inversePrimaryDark,
  elevationOverlay: COLORS.elevationOverlayDark,
};

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'system'
}) => {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const isDark = theme === 'dark' ||
    (theme === 'system' && systemColorScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const value: ThemeContextType = {
    theme,
    colors,
    isDark,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};