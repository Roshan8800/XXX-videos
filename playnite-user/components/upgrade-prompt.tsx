import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card } from '../../shared/components';
import { PrimaryButton, SecondaryButton } from '../../shared/components/button';
import { Icon } from '../../shared/utils/icons';

interface UpgradePromptProps {
  onUpgrade: () => void;
  onLearnMore?: () => void;
  variant?: 'banner' | 'card' | 'modal';
  showTrialInfo?: boolean;
  customMessage?: string;
  style?: any;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  onUpgrade,
  onLearnMore,
  variant = 'card',
  showTrialInfo = true,
  customMessage,
  style,
}) => {
  const { colors } = useTheme();

  const defaultMessage = "Unlock premium features and exclusive content with a subscription";
  const message = customMessage || defaultMessage;

  const features = [
    'HD & 4K streaming quality',
    'Exclusive premium content',
    'Offline viewing capabilities',
    'Ad-free experience',
  ];

  if (variant === 'banner') {
    return (
      <View style={[
        {
          backgroundColor: colors.primaryContainer,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
          marginBottom: 16,
        },
        style
      ]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Typography variant="bodyLarge" color="onPrimaryContainer" style={{ marginBottom: 4 }}>
              Upgrade to Premium
            </Typography>
            <Typography variant="bodyMedium" color="onPrimaryContainer">
              {message}
            </Typography>
          </View>
          <PrimaryButton
            onPress={onUpgrade}
            size="small"
            style={{ marginLeft: 16 }}
          >
            Upgrade
          </PrimaryButton>
        </View>
      </View>
    );
  }

  if (variant === 'modal') {
    return (
      <View style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 24,
          margin: 16,
          maxWidth: 400,
          alignSelf: 'center',
        },
        style
      ]}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.primaryContainer,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Icon name="star" size={32} color={colors.onPrimaryContainer} />
          </View>
          <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 8 }}>
            Upgrade to Premium
          </Typography>
          <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
            {message}
          </Typography>
        </View>

        <View style={{ marginBottom: 24 }}>
          {features.map((feature, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Icon name="check_circle" size={20} color={colors.primary} style={{ marginRight: 12 }} />
              <Typography variant="bodyMedium" color="onSurface">
                {feature}
              </Typography>
            </View>
          ))}
        </View>

        {showTrialInfo && (
          <View style={{
            backgroundColor: colors.secondaryContainer,
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
          }}>
            <Typography variant="bodyMedium" color="onSecondaryContainer" style={{ textAlign: 'center' }}>
              🎉 Start your 14-day free trial today!
            </Typography>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SecondaryButton
            onPress={onLearnMore || onUpgrade}
            style={{ flex: 1 }}
          >
            Learn More
          </SecondaryButton>
          <PrimaryButton
            onPress={onUpgrade}
            style={{ flex: 1 }}
          >
            Start Free Trial
          </PrimaryButton>
        </View>
      </View>
    );
  }

  // Default card variant
  return (
    <Card style={[{ padding: 20 }, style]}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.primaryContainer,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <Icon name="star" size={24} color={colors.onPrimaryContainer} />
        </View>
        <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 8 }}>
          Upgrade to Premium
        </Typography>
        <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
          {message}
        </Typography>
      </View>

      <View style={{ marginBottom: 20 }}>
        {features.map((feature, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon name="check_circle" size={16} color={colors.primary} style={{ marginRight: 8 }} />
            <Typography variant="bodyMedium" color="onSurface">
              {feature}
            </Typography>
          </View>
        ))}
      </View>

      {showTrialInfo && (
        <View style={{
          backgroundColor: colors.secondaryContainer,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          marginBottom: 16,
        }}>
          <Typography variant="bodySmall" color="onSecondaryContainer" style={{ textAlign: 'center' }}>
            Start your 14-day free trial - Cancel anytime
          </Typography>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SecondaryButton
          onPress={onLearnMore || onUpgrade}
          style={{ flex: 1 }}
        >
          Learn More
        </SecondaryButton>
        <PrimaryButton
          onPress={onUpgrade}
          style={{ flex: 1 }}
        >
          Start Free Trial
        </PrimaryButton>
      </View>
    </Card>
  );
};

// Specialized upgrade prompts for different contexts
export const TrialEndingPrompt: React.FC<Omit<UpgradePromptProps, 'customMessage'>> = (props) => (
  <UpgradePrompt
    {...props}
    customMessage="Your trial is ending soon. Upgrade now to continue enjoying premium features!"
    showTrialInfo={false}
  />
);

export const ContentLockedPrompt: React.FC<Omit<UpgradePromptProps, 'customMessage'>> = (props) => (
  <UpgradePrompt
    {...props}
    customMessage="This content is exclusive to premium subscribers. Upgrade to unlock!"
    showTrialInfo={true}
  />
);

export const FeatureLockedPrompt: React.FC<{ featureName: string } & Omit<UpgradePromptProps, 'customMessage'>> = ({
  featureName,
  ...props
}) => (
  <UpgradePrompt
    {...props}
    customMessage={`The "${featureName}" feature is available with premium subscription. Upgrade to access!`}
    showTrialInfo={true}
  />
);