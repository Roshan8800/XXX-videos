import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ClickableCard } from '../../shared/components';
import { PrimaryButton } from '../../shared/components/button';
import { Icon } from '../../shared/utils/icons';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: 'month' | 'year';
  description: string;
  features: string[];
  popular?: boolean;
  trialDays?: number;
}

interface SubscriptionPlansProps {
  currentPlan: 'free' | 'basic' | 'premium' | 'family';
  onPlanSelect: (plan: SubscriptionPlan) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  currentPlan,
  onPlanSelect,
}) => {
  const { colors } = useTheme();

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      period: 'month',
      description: 'Basic access to content',
      features: [
        'Access to free content',
        'Standard quality streaming',
        'Basic search functionality',
        'Community features',
      ],
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 4.99,
      currency: 'USD',
      period: 'month',
      description: 'Enhanced viewing experience',
      features: [
        'Everything in Free',
        'HD quality streaming',
        'Offline viewing (1 device)',
        'Ad-free experience',
        'Basic customer support',
      ],
      trialDays: 7,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      currency: 'USD',
      period: 'month',
      description: 'Ultimate entertainment experience',
      features: [
        'Everything in Basic',
        '4K Ultra HD streaming',
        'Offline viewing (unlimited devices)',
        'Exclusive premium content',
        'Early access to new releases',
        'Priority customer support',
        'Custom playlists',
      ],
      popular: true,
      trialDays: 14,
    },
    {
      id: 'family',
      name: 'Family',
      price: 14.99,
      currency: 'USD',
      period: 'month',
      description: 'Share with your loved ones',
      features: [
        'Everything in Premium',
        'Up to 6 family members',
        'Individual profiles',
        'Parental controls',
        'Family sharing features',
        'Family activity reports',
      ],
      trialDays: 30,
    },
  ];

  const PlanCard: React.FC<{ plan: SubscriptionPlan }> = ({ plan }) => {
    const isCurrentPlan = currentPlan === plan.id;
    const isPopular = plan.popular;

    return (
      <ClickableCard
        style={{
          marginBottom: 16,
          borderWidth: isCurrentPlan ? 2 : 1,
          borderColor: isCurrentPlan ? colors.primary : colors.outline,
          position: 'relative',
        }}
        onPress={() => onPlanSelect(plan)}
      >
        {isPopular && (
          <View style={{
            position: 'absolute',
            top: -8,
            right: 16,
            backgroundColor: colors.primary,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
            zIndex: 1,
          }}>
            <Typography variant="bodySmall" color="onPrimary">
              Most Popular
            </Typography>
          </View>
        )}

        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Typography variant="titleLarge" color="onSurface" style={{ flex: 1 }}>
              {plan.name}
            </Typography>
            {isCurrentPlan && (
              <View style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Typography variant="bodySmall" color="onPrimary">
                  Current
                </Typography>
              </View>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 }}>
            <Typography variant="displaySmall" color="onSurface">
              ${plan.price}
            </Typography>
            <Typography variant="titleMedium" color="onSurfaceVariant" style={{ marginLeft: 4 }}>
              /{plan.period}
            </Typography>
          </View>

          <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginBottom: 16 }}>
            {plan.description}
          </Typography>

          {plan.trialDays && (
            <View style={{
              backgroundColor: colors.secondaryContainer,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              marginBottom: 16,
            }}>
              <Typography variant="bodySmall" color="onSecondaryContainer">
                🎉 {plan.trialDays} days free trial
              </Typography>
            </View>
          )}

          <View style={{ marginBottom: 20 }}>
            {plan.features.map((feature, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Icon name="check_circle" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                <Typography variant="bodyMedium" color="onSurface">
                  {feature}
                </Typography>
              </View>
            ))}
          </View>

          <PrimaryButton
            onPress={() => onPlanSelect(plan)}
            disabled={isCurrentPlan}
            style={{ width: '100%' }}
          >
            {isCurrentPlan ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Subscribe'}
          </PrimaryButton>
        </View>
      </ClickableCard>
    );
  };

  return (
    <View>
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}

      {/* Billing Information */}
      <Card style={{ padding: 16, marginTop: 16 }}>
        <Typography variant="bodySmall" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
          All plans include a 30-day money-back guarantee. Cancel anytime.
        </Typography>
        <Typography variant="bodySmall" color="onSurfaceVariant" style={{ textAlign: 'center', marginTop: 8 }}>
          By subscribing, you agree to our Terms of Service and Privacy Policy.
        </Typography>
      </Card>
    </View>
  );
};