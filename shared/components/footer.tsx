import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon } from '../utils/icons';
import { useTheme } from '../utils/theme-context';
import { Typography } from '../utils/typography';

interface FooterProps {
  showBranding?: boolean;
  showSocialLinks?: boolean;
  showCopyright?: boolean;
  onPrivacyPress?: () => void;
  onTermsPress?: () => void;
  onSupportPress?: () => void;
}

export const PlayNiteFooter: React.FC<FooterProps> = ({
  showBranding = true,
  showSocialLinks = true,
  showCopyright = true,
  onPrivacyPress,
  onTermsPress,
  onSupportPress,
}) => {
  const { colors } = useTheme();

  return (
    <View style={{
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.outlineVariant,
      paddingVertical: 16,
      paddingHorizontal: 16,
    }}>
      {/* Branding Section */}
      {showBranding && (
        <View style={{
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Icon
            name="playnite_logo"
            size={32}
            color={colors.primary}
          />
          <Typography
            variant="titleMedium"
            color="onSurface"
            style={{ marginTop: 8 }}
          >
            PlayNite
          </Typography>
          <Typography
            variant="bodySmall"
            color="onSurfaceVariant"
            style={{ textAlign: 'center' }}
          >
            Your premium entertainment experience
          </Typography>
        </View>
      )}

      {/* Links Section */}
      {(onPrivacyPress || onTermsPress || onSupportPress) && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 16,
          gap: 24,
        }}>
          {onPrivacyPress && (
            <TouchableOpacity onPress={onPrivacyPress}>
              <Typography variant="bodySmall" color="primary">
                Privacy
              </Typography>
            </TouchableOpacity>
          )}
          {onTermsPress && (
            <TouchableOpacity onPress={onTermsPress}>
              <Typography variant="bodySmall" color="primary">
                Terms
              </Typography>
            </TouchableOpacity>
          )}
          {onSupportPress && (
            <TouchableOpacity onPress={onSupportPress}>
              <Typography variant="bodySmall" color="primary">
                Support
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Copyright Section */}
      {showCopyright && (
        <View style={{ alignItems: 'center' }}>
          <Typography
            variant="bodySmall"
            color="onSurfaceVariant"
            style={{ textAlign: 'center' }}
          >
            © 2024 PlayNite. All rights reserved.
          </Typography>
        </View>
      )}
    </View>
  );
};