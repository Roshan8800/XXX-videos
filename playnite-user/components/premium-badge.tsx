import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';

interface PremiumBadgeProps {
  isExclusive?: boolean;
  earlyAccess?: boolean;
  offlineAvailable?: boolean;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  style?: any;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  isExclusive = false,
  earlyAccess = false,
  offlineAvailable = false,
  size = 'medium',
  showIcon = true,
  style,
}) => {
  const { colors } = useTheme();

  const getBadgeStyle = () => {
    const baseStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: size === 'small' ? 6 : size === 'medium' ? 8 : 12,
      paddingVertical: size === 'small' ? 2 : size === 'medium' ? 4 : 6,
      borderRadius: size === 'small' ? 8 : size === 'medium' ? 12 : 16,
      margin: 2,
    };

    if (isExclusive) {
      return {
        ...baseStyle,
        backgroundColor: '#FFD700', // Gold color for exclusive
      };
    } else if (earlyAccess) {
      return {
        ...baseStyle,
        backgroundColor: colors.primary,
      };
    } else if (offlineAvailable) {
      return {
        ...baseStyle,
        backgroundColor: colors.secondary,
      };
    }

    return {
      ...baseStyle,
      backgroundColor: colors.primary,
    };
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'medium': return 16;
      case 'large': return 20;
      default: return 16;
    }
  };

  const getTypographyVariant = () => {
    switch (size) {
      case 'small': return 'labelSmall' as const;
      case 'medium': return 'bodySmall' as const;
      case 'large': return 'bodyMedium' as const;
      default: return 'bodySmall' as const;
    }
  };

  const getBadgeText = () => {
    if (isExclusive) return 'Exclusive';
    if (earlyAccess) return 'Early Access';
    if (offlineAvailable) return 'Offline';
    return 'Premium';
  };

  const getIconName = () => {
    if (isExclusive) return 'star';
    if (earlyAccess) return 'visibility';
    if (offlineAvailable) return 'download';
    return 'star';
  };

  if (!isExclusive && !earlyAccess && !offlineAvailable) {
    return null;
  }

  return (
    <View style={[getBadgeStyle(), style]}>
      {showIcon && (
        <Icon
          name={getIconName()}
          size={getIconSize()}
          color={isExclusive ? '#000' : 'onPrimary'}
          style={{ marginRight: 4 }}
        />
      )}
      <Typography
        variant={getTypographyVariant()}
        color={isExclusive ? 'onPrimary' : 'onPrimary'}
      >
        {getBadgeText()}
      </Typography>
    </View>
  );
};

// Specialized badge components for specific use cases
export const ExclusiveBadge: React.FC<Omit<PremiumBadgeProps, 'isExclusive' | 'earlyAccess' | 'offlineAvailable'>> = (props) => (
  <PremiumBadge {...props} isExclusive={true} />
);

export const EarlyAccessBadge: React.FC<Omit<PremiumBadgeProps, 'isExclusive' | 'earlyAccess' | 'offlineAvailable'>> = (props) => (
  <PremiumBadge {...props} earlyAccess={true} />
);

export const OfflineBadge: React.FC<Omit<PremiumBadgeProps, 'isExclusive' | 'earlyAccess' | 'offlineAvailable'>> = (props) => (
  <PremiumBadge {...props} offlineAvailable={true} />
);

// Badge for content cards
export const ContentBadge: React.FC<{
  isPremium: boolean;
  isExclusive?: boolean;
  earlyAccess?: boolean;
  offlineAvailable?: boolean;
}> = ({ isPremium, isExclusive, earlyAccess, offlineAvailable }) => {
  const { colors } = useTheme();

  if (!isPremium && !isExclusive && !earlyAccess && !offlineAvailable) {
    return null;
  }

  return (
    <View style={{
      position: 'absolute',
      top: 4,
      left: 4,
      flexDirection: 'row',
      gap: 4,
    }}>
      {isPremium && (
        <View style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 8,
        }}>
          <Typography variant="labelSmall" color="onPrimary">
            Premium
          </Typography>
        </View>
      )}
      {isExclusive && (
        <View style={{
          backgroundColor: '#FFD700',
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 8,
        }}>
          <Typography variant="labelSmall" color="onPrimary">
            Exclusive
          </Typography>
        </View>
      )}
      {earlyAccess && (
        <View style={{
          backgroundColor: colors.tertiary,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 8,
        }}>
          <Typography variant="labelSmall" color="onTertiary">
            Early
          </Typography>
        </View>
      )}
      {offlineAvailable && (
        <View style={{
          backgroundColor: colors.secondary,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 8,
        }}>
          <Typography variant="labelSmall" color="onSecondary">
            Offline
          </Typography>
        </View>
      )}
    </View>
  );
};