import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card } from '../../shared/components';
import { PrimaryButton } from '../../shared/components/button';
import { Icon } from '../../shared/utils/icons';

interface PlanFeature {
  name: string;
  free: boolean | string;
  basic: boolean | string;
  premium: boolean | string;
  family: boolean | string;
}

interface PlanComparisonProps {
  currentPlan: 'free' | 'basic' | 'premium' | 'family';
  onPlanSelect?: (plan: 'free' | 'basic' | 'premium' | 'family') => void;
}

export const PlanComparison: React.FC<PlanComparisonProps> = ({
  currentPlan,
  onPlanSelect,
}) => {
  const { colors } = useTheme();

  const features: PlanFeature[] = [
    {
      name: 'Streaming Quality',
      free: 'Standard',
      basic: 'HD',
      premium: '4K Ultra HD',
      family: '4K Ultra HD',
    },
    {
      name: 'Ad-free Experience',
      free: false,
      basic: true,
      premium: true,
      family: true,
    },
    {
      name: 'Offline Downloads',
      free: false,
      basic: '1 device',
      premium: 'Unlimited devices',
      family: 'Unlimited devices',
    },
    {
      name: 'Exclusive Content',
      free: false,
      basic: false,
      premium: true,
      family: true,
    },
    {
      name: 'Early Access',
      free: false,
      basic: false,
      premium: true,
      family: true,
    },
    {
      name: 'Custom Playlists',
      free: false,
      basic: false,
      premium: true,
      family: true,
    },
    {
      name: 'Family Members',
      free: '1',
      basic: '1',
      premium: '1',
      family: 'Up to 6',
    },
    {
      name: 'Customer Support',
      free: 'Community',
      basic: 'Email',
      premium: 'Priority',
      family: 'Priority',
    },
    {
      name: 'Free Trial',
      free: false,
      basic: '7 days',
      premium: '14 days',
      family: '30 days',
    },
  ];

  const plans = [
    { key: 'free', name: 'Free', price: '$0' },
    { key: 'basic', name: 'Basic', price: '$4.99' },
    { key: 'premium', name: 'Premium', price: '$9.99' },
    { key: 'family', name: 'Family', price: '$14.99' },
  ];

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Icon name="check_circle" size={20} color={colors.primary} />
      ) : (
        <Icon name="close" size={20} color={colors.error} />
      );
    }
    return (
      <Typography variant="bodySmall" color="onSurface">
        {value}
      </Typography>
    );
  };

  const getCurrentPlanIndex = () => {
    return plans.findIndex(plan => plan.key === currentPlan);
  };

  return (
    <Card style={{ padding: 0 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header Row */}
          <View style={{ flexDirection: 'row', backgroundColor: colors.surfaceVariant, padding: 16 }}>
            <View style={{ width: 200, paddingVertical: 8 }}>
              <Typography variant="titleMedium" color="onSurfaceVariant">
                Features
              </Typography>
            </View>
            {plans.map((plan, index) => (
              <View
                key={plan.key}
                style={{
                  width: 120,
                  alignItems: 'center',
                  paddingVertical: 8,
                  marginLeft: index === getCurrentPlanIndex() ? 2 : 0,
                  marginRight: index === getCurrentPlanIndex() ? 2 : 0,
                }}
              >
                <Typography
                  variant="titleMedium"
                  color={index === getCurrentPlanIndex() ? 'primary' : 'onSurfaceVariant'}
                  style={{
                    fontWeight: index === getCurrentPlanIndex() ? 'bold' : 'normal',
                  }}
                >
                  {plan.name}
                </Typography>
                <Typography
                  variant="bodyMedium"
                  color={index === getCurrentPlanIndex() ? 'primary' : 'onSurfaceVariant'}
                >
                  {plan.price}/mo
                </Typography>
                {index === getCurrentPlanIndex() && (
                  <View style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                    marginTop: 4,
                  }}>
                    <Typography variant="labelSmall" color="onPrimary">
                      Current
                    </Typography>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Feature Rows */}
          {features.map((feature, featureIndex) => (
            <View
              key={feature.name}
              style={{
                flexDirection: 'row',
                padding: 16,
                borderBottomWidth: featureIndex < features.length - 1 ? 1 : 0,
                borderBottomColor: colors.outline,
                backgroundColor: featureIndex % 2 === 0 ? colors.background : colors.surface,
              }}
            >
              <View style={{ width: 200, justifyContent: 'center' }}>
                <Typography variant="bodyLarge" color="onSurface">
                  {feature.name}
                </Typography>
              </View>
              {plans.map((plan) => (
                <View
                  key={`${plan.key}-${feature.name}`}
                  style={{
                    width: 120,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: plan.key === currentPlan ? 2 : 0,
                    marginRight: plan.key === currentPlan ? 2 : 0,
                  }}
                >
                  {renderFeatureValue(feature[plan.key as keyof PlanFeature] as boolean | string)}
                </View>
              ))}
            </View>
          ))}

          {/* Action Row */}
          <View style={{
            flexDirection: 'row',
            padding: 16,
            backgroundColor: colors.surfaceVariant,
            gap: 8,
          }}>
            <View style={{ width: 200 }} />
            {plans.map((plan, index) => (
              <View
                key={`action-${plan.key}`}
                style={{
                  width: 120,
                  marginLeft: index === getCurrentPlanIndex() ? 2 : 0,
                  marginRight: index === getCurrentPlanIndex() ? 2 : 0,
                }}
              >
                {plan.key !== currentPlan && (
                  <PrimaryButton
                    onPress={() => onPlanSelect?.(plan.key as any)}
                    size="small"
                    style={{ width: '100%' }}
                  >
                    {plan.key === 'free' ? 'Downgrade' : 'Upgrade'}
                  </PrimaryButton>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={{
        padding: 16,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.outline,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="check_circle" size={16} color={colors.primary} style={{ marginRight: 4 }} />
            <Typography variant="bodySmall" color="onSurfaceVariant">
              Included
            </Typography>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="close" size={16} color={colors.error} style={{ marginRight: 4 }} />
            <Typography variant="bodySmall" color="onSurfaceVariant">
              Not included
            </Typography>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginRight: 4 }}>
              Text
            </Typography>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              Feature details
            </Typography>
          </View>
        </View>
      </View>
    </Card>
  );
};