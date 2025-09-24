import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card } from '../../shared/components';
import { PrimaryButton, SecondaryButton } from '../../shared/components/button';
import { Icon } from '../../shared/utils/icons';

interface UserSubscription {
  plan: 'free' | 'basic' | 'premium' | 'family';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  trialDaysLeft?: number;
  nextBillingDate?: string;
  familyMembers?: number;
  maxFamilyMembers?: number;
  paymentMethod?: {
    type: 'card' | 'paypal' | 'apple' | 'google';
    last4?: string;
    expiryDate?: string;
  };
  billingHistory?: BillingRecord[];
}

interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  status: 'paid' | 'pending' | 'failed';
}

interface BillingInfoProps {
  subscription: UserSubscription;
  onManageBilling: () => void;
  onUpdatePayment?: () => void;
  onCancelSubscription?: () => void;
  onViewHistory?: () => void;
}

export const BillingInfo: React.FC<BillingInfoProps> = ({
  subscription,
  onManageBilling,
  onUpdatePayment,
  onCancelSubscription,
  onViewHistory,
}) => {
  const { colors } = useTheme();

  const getStatusColor = (status: UserSubscription['status']) => {
    switch (status) {
      case 'active': return colors.primary;
      case 'trial': return colors.secondary;
      case 'expired': return colors.error;
      case 'cancelled': return colors.error;
      default: return colors.onSurfaceVariant;
    }
  };

  const getStatusText = (status: UserSubscription['status']) => {
    switch (status) {
      case 'active': return 'Active';
      case 'trial': return 'Trial';
      case 'expired': return 'Expired';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { text: 'Cancel Subscription', style: 'destructive', onPress: onCancelSubscription },
      ]
    );
  };

  const handleUpdatePayment = () => {
    Alert.alert(
      'Update Payment Method',
      'You will be redirected to update your payment method.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: onUpdatePayment },
      ]
    );
  };

  return (
    <View>
      {/* Current Subscription Status */}
      <Card style={{ padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Typography variant="titleMedium" color="onSurface" style={{ flex: 1 }}>
            Subscription Status
          </Typography>
          <View style={{
            backgroundColor: getStatusColor(subscription.status),
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
            <Typography variant="bodySmall" color="onPrimary">
              {getStatusText(subscription.status)}
            </Typography>
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Typography variant="bodyLarge" color="onSurface">
            {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
          </Typography>
          {subscription.status === 'trial' && subscription.trialDaysLeft && (
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {subscription.trialDaysLeft} days remaining in trial
            </Typography>
          )}
        </View>

        {subscription.nextBillingDate && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Icon name="info" size={16} color={colors.onSurfaceVariant} style={{ marginRight: 8 }} />
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              Next billing: {subscription.nextBillingDate}
            </Typography>
          </View>
        )}

        {subscription.paymentMethod && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="account_circle" size={16} color={colors.onSurfaceVariant} style={{ marginRight: 8 }} />
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {subscription.paymentMethod.type.charAt(0).toUpperCase() + subscription.paymentMethod.type.slice(1)} •••• {subscription.paymentMethod.last4}
            </Typography>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <SecondaryButton
            onPress={onManageBilling}
            style={{ flex: 1 }}
          >
            Manage
          </SecondaryButton>
          {subscription.paymentMethod && (
            <SecondaryButton
              onPress={handleUpdatePayment}
              style={{ flex: 1 }}
            >
              Update Payment
            </SecondaryButton>
          )}
        </View>
      </Card>

      {/* Family Plan Management */}
      {subscription.plan === 'family' && subscription.familyMembers !== undefined && (
        <Card style={{ padding: 16, marginBottom: 16 }}>
          <Typography variant="titleMedium" color="onSurface" style={{ marginBottom: 12 }}>
            Family Plan
          </Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Icon name="group" size={16} color={colors.onSurfaceVariant} style={{ marginRight: 8 }} />
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {subscription.familyMembers} of {subscription.maxFamilyMembers} members
            </Typography>
          </View>
          <PrimaryButton onPress={() => console.log('Manage family members')}>
            Manage Family
          </PrimaryButton>
        </Card>
      )}

      {/* Billing History */}
      <Card style={{ padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Typography variant="titleMedium" color="onSurface" style={{ flex: 1 }}>
            Billing History
          </Typography>
          <TouchableOpacity onPress={onViewHistory}>
            <Typography variant="bodyMedium" color="primary">
              View All
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Recent billing records */}
        {subscription.billingHistory && subscription.billingHistory.length > 0 ? (
          subscription.billingHistory.slice(0, 3).map((record) => (
            <View key={record.id} style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: colors.outline,
            }}>
              <View style={{ flex: 1 }}>
                <Typography variant="bodyMedium" color="onSurface">
                  {record.description}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  {record.date}
                </Typography>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Typography variant="bodyMedium" color="onSurface">
                  ${record.amount}
                </Typography>
                <View style={{
                  backgroundColor: record.status === 'paid' ? colors.primary : colors.error,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 8,
                }}>
                  <Typography variant="labelSmall" color="onPrimary">
                    {record.status}
                  </Typography>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 16 }}>
            <Icon name="info" size={24} color={colors.onSurfaceVariant} style={{ marginBottom: 8 }} />
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              No billing history available
            </Typography>
          </View>
        )}
      </Card>

      {/* Subscription Actions */}
      {subscription.status === 'active' && subscription.plan !== 'free' && (
        <Card style={{ padding: 16 }}>
          <Typography variant="titleMedium" color="onSurface" style={{ marginBottom: 12 }}>
            Subscription Actions
          </Typography>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SecondaryButton
              onPress={onManageBilling}
              style={{ flex: 1 }}
            >
              Pause Subscription
            </SecondaryButton>
            <SecondaryButton
              onPress={handleCancelSubscription}
              style={{ flex: 1 }}
            >
              Cancel
            </SecondaryButton>
          </View>
        </Card>
      )}

      {/* Help & Support */}
      <Card style={{ padding: 16, marginTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Icon name="help" size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Typography variant="titleMedium" color="onSurface">
            Need Help?
          </Typography>
        </View>
        <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginBottom: 12 }}>
          Have questions about your subscription or billing? Our support team is here to help.
        </Typography>
        <PrimaryButton onPress={() => console.log('Contact support')}>
          Contact Support
        </PrimaryButton>
      </Card>
    </View>
  );
};