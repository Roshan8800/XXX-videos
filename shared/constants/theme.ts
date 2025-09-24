// PlayNite Theme Configuration
// Based on Material Design 3 with custom pink/magenta color scheme

export const COLORS = {
  // Primary colors - Pink/Magenta theme
  primary: '#d41173',
  onPrimary: '#ffffff',
  primaryContainer: '#ffd9e8',
  onPrimaryContainer: '#3e001d',

  // Secondary colors
  secondary: '#75546f',
  onSecondary: '#ffffff',
  secondaryContainer: '#ffd7f3',
  onSecondaryContainer: '#2b1229',

  // Tertiary colors
  tertiary: '#70576b',
  onTertiary: '#ffffff',
  tertiaryContainer: '#fbd7f0',
  onTertiaryContainer: '#281421',

  // Error colors
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#410002',

  // Background colors
  background: '#fffbff',
  onBackground: '#1f1a1d',
  surface: '#fffbff',
  onSurface: '#1f1a1d',
  surfaceVariant: '#f0dee5',
  onSurfaceVariant: '#504349',
  surfaceTint: '#d41173',

  // Dark theme colors
  backgroundDark: '#221019',
  onBackgroundDark: '#eadfe5',
  surfaceDark: '#221019',
  onSurfaceDark: '#eadfe5',
  surfaceVariantDark: '#504349',
  onSurfaceVariantDark: '#d3c2c9',

  // Outline colors
  outline: '#827379',
  outlineVariant: '#d3c2c9',

  // Special colors
  inverseSurface: '#342f33',
  inverseOnSurface: '#f8eef3',
  inversePrimary: '#ffb0d1',

  // Dark theme special colors
  inverseSurfaceDark: '#eadfe5',
  inverseOnSurfaceDark: '#342f33',
  inversePrimaryDark: '#e91e63',

  // Elevation overlays
  elevationOverlayLight: 'rgba(0, 0, 0, 0.05)',
  elevationOverlayDark: 'rgba(255, 255, 255, 0.05)',
} as const;

export const TYPOGRAPHY = {
  // Font families
  display: 'Spline Sans',
  body: 'Spline Sans',

  // Font weights
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '900',

  // Font sizes - Material Design 3 scale
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400' as const,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400' as const,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '400' as const,
  },
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400' as const,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400' as const,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400' as const,
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '500' as const,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 28,
  full: 9999,
} as const;

export const ELEVATION = {
  level0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.11,
    shadowRadius: 4,
    elevation: 3,
  },
  level4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 4,
  },
  level5: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 5,
  },
} as const;