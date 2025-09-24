import React from 'react';
import { View, ViewProps, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from '../utils/theme-context';
import { Typography } from '../utils/typography';
import { Icon, IconName } from '../utils/icons';
import { ELEVATION } from '../constants/theme';

export type AppBarVariant = 'centerAligned' | 'small' | 'medium' | 'large';

interface AppBarProps extends ViewProps {
  variant?: AppBarVariant;
  title?: string;
  subtitle?: string;
  leadingIcon?: IconName;
  trailingIcons?: IconName[];
  onLeadingIconPress?: () => void;
  onTrailingIconPress?: (icon: IconName) => void;
  elevated?: boolean;
  showLogo?: boolean;
  children?: React.ReactNode;
}

export const AppBar: React.FC<AppBarProps> = ({
  variant = 'centerAligned',
  title,
  subtitle,
  leadingIcon,
  trailingIcons = [],
  onLeadingIconPress,
  onTrailingIconPress,
  elevated = false,
  showLogo = false,
  style,
  children,
  ...props
}) => {
  const { colors, isDark } = useTheme();

  const getAppBarStyles = () => {
    const baseStyles = {
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
      paddingHorizontal: 16,
      paddingTop: StatusBar.currentHeight || 0,
    };

    const variantStyles = {
      centerAligned: {
        height: 64,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      small: {
        height: 64,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
      },
      medium: {
        height: 112,
        flexDirection: 'column' as const,
        justifyContent: 'flex-end' as const,
        paddingBottom: 16,
      },
      large: {
        height: 152,
        flexDirection: 'column' as const,
        justifyContent: 'flex-end' as const,
        paddingBottom: 16,
      },
    };

    const elevatedStyles = elevated ? {
      ...ELEVATION.level2,
    } : {};

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...elevatedStyles,
    };
  };

  const getTitleVariant = () => {
    switch (variant) {
      case 'large':
        return 'headlineSmall';
      case 'medium':
        return 'headlineSmall';
      case 'small':
        return 'titleLarge';
      case 'centerAligned':
        return 'titleLarge';
      default:
        return 'titleLarge';
    }
  };

  const getSubtitleVariant = () => {
    switch (variant) {
      case 'large':
        return 'titleMedium';
      case 'medium':
        return 'bodyLarge';
      default:
        return 'bodyMedium';
    }
  };

  const renderLeadingIcon = () => {
    if (!leadingIcon) return null;

    return (
      <TouchableOpacity
        onPress={onLeadingIconPress}
        style={{
          padding: 8,
          marginRight: 16,
          borderRadius: 20,
        }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon
          name={leadingIcon}
          size={24}
          color={colors.onSurface}
        />
      </TouchableOpacity>
    );
  };

  const renderTrailingIcons = () => {
    if (trailingIcons.length === 0) return null;

    return (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {trailingIcons.map((iconName, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onTrailingIconPress?.(iconName)}
            style={{
              padding: 8,
              borderRadius: 20,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon
              name={iconName}
              size={24}
              color={colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderTitle = () => {
    if (!title && !showLogo) return null;

    return (
      <View style={{
        flex: 1,
        alignItems: variant === 'centerAligned' ? 'center' : 'flex-start',
        justifyContent: 'center',
      }}>
        {showLogo && (
          <View style={{ alignItems: 'center', marginBottom: 4 }}>
            <Icon
              name="playnite_logo"
              size={24}
              color={colors.onSurface}
            />
          </View>
        )}
        {title && (
          <Typography
            variant={getTitleVariant()}
            color="onSurface"
            align="center"
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant={getSubtitleVariant()}
            color="onSurfaceVariant"
            align="center"
          >
            {subtitle}
          </Typography>
        )}
      </View>
    );
  };

  const renderContent = () => {
    switch (variant) {
      case 'centerAligned':
        return (
          <>
            {renderLeadingIcon()}
            {renderTitle()}
            {renderTrailingIcons()}
          </>
        );

      case 'small':
        return (
          <>
            {renderLeadingIcon()}
            {renderTitle()}
            {renderTrailingIcons()}
          </>
        );

      case 'medium':
      case 'large':
        return (
          <View style={{ width: '100%' }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              {renderLeadingIcon()}
              {renderTrailingIcons()}
            </View>
            {renderTitle()}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[getAppBarStyles(), style]} {...props}>
      {renderContent()}
      {children}
    </View>
  );
};

// Convenience app bar components
export const CenterAlignedAppBar: React.FC<Omit<AppBarProps, 'variant'>> = (props) => (
  <AppBar variant="centerAligned" {...props} />
);

export const SmallAppBar: React.FC<Omit<AppBarProps, 'variant'>> = (props) => (
  <AppBar variant="small" {...props} />
);

export const MediumAppBar: React.FC<Omit<AppBarProps, 'variant'>> = (props) => (
  <AppBar variant="medium" {...props} />
);

export const LargeAppBar: React.FC<Omit<AppBarProps, 'variant'>> = (props) => (
  <AppBar variant="large" {...props} />
);