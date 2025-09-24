import React from 'react';
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ClickableCard, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton } from '../../shared/components/button';
import { SubscriptionPlans } from '../components/subscription-plans';
import { PremiumBadge } from '../components/premium-badge';
import { UpgradePrompt } from '../components/upgrade-prompt';
import { BillingInfo } from '../components/billing-info';
import { PlanComparison } from '../components/plan-comparison';

interface PremiumContent {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  isExclusive: boolean;
  earlyAccess?: boolean;
  offlineAvailable?: boolean;
}

interface UserSubscription {
  plan: 'free' | 'basic' | 'premium' | 'family';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  trialDaysLeft?: number;
  nextBillingDate?: string;
  familyMembers?: number;
  maxFamilyMembers?: number;
}

export const PremiumContentScreen: React.FC = () => {
  const { colors } = useTheme();

  const userSubscription: UserSubscription = {
    plan: 'basic',
    status: 'active',
    nextBillingDate: '2024-10-24',
    familyMembers: 1,
    maxFamilyMembers: 1,
  };

  const premiumContent: PremiumContent[] = [
    {
      id: '1',
      title: 'Exclusive Behind the Scenes',
      description: 'Get exclusive access to behind-the-scenes content and bloopers',
      thumbnail: 'https://example.com/premium1.jpg',
      duration: '45:30',
      category: 'Behind the Scenes',
      isExclusive: true,
      earlyAccess: true,
      offlineAvailable: true,
    },
    {
      id: '2',
      title: 'Premium Director\'s Cut',
      description: 'Extended director\'s cut with deleted scenes and commentary',
      thumbnail: 'https://example.com/premium2.jpg',
      duration: '120:00',
      category: 'Director\'s Cut',
      isExclusive: true,
      offlineAvailable: true,
    },
    {
      id: '3',
      title: 'Early Access Premiere',
      description: 'Be the first to watch new releases before public premiere',
      thumbnail: 'https://example.com/premium3.jpg',
      duration: '90:00',
      category: 'Early Access',
      isExclusive: true,
      earlyAccess: true,
    },
  ];

  const usageStats = {
    videosWatched: 45,
    hoursWatched: 127,
    downloadsUsed: 12,
    storageUsed: 8.5, // GB
  };

  const handleContentPress = (content: PremiumContent) => {
    if (content.isExclusive && userSubscription.plan === 'free') {
      Alert.alert(
        'Premium Content',
        'This exclusive content requires a premium subscription. Upgrade now to access?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => console.log('Navigate to upgrade') },
        ]
      );
    } else {
      console.log('Play premium content:', content.title);
    }
  };

  const handleUpgradePress = () => {
    console.log('Navigate to subscription plans');
  };

  const handleManageBilling = () => {
    console.log('Navigate to billing management');
  };

  const PremiumContentCard: React.FC<{ content: PremiumContent }> = ({ content }) => (
    <ClickableCard
      style={{
        marginBottom: 16,
        overflow: 'hidden',
      }}
      onPress={() => handleContentPress(content)}
    >
      <View style={{
        flexDirection: 'row',
        padding: 12,
      }}>
        <View style={{ position: 'relative', marginRight: 12 }}>
          <View style={{
            width: 120,
            height: 68,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Icon name="play_arrow" size={24} color={colors.onSurfaceVariant} />
          </View>
          <View style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 2,
          }}>
            <Typography variant="bodySmall" color="onPrimary">
              {content.duration}
            </Typography>
          </View>
          <PremiumBadge
            isExclusive={content.isExclusive}
            earlyAccess={content.earlyAccess}
            offlineAvailable={content.offlineAvailable}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Typography
            variant="bodyLarge"
            color="onSurface"
            numberOfLines={2}
            style={{ marginBottom: 4 }}
          >
            {content.title}
          </Typography>
          <Typography
            variant="bodySmall"
            color="onSurfaceVariant"
            numberOfLines={2}
            style={{ marginBottom: 4 }}
          >
            {content.description}
          </Typography>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              {content.category}
            </Typography>
          </View>
        </View>
      </View>
    </ClickableCard>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* App Bar */}
      <AppBar
        title="Premium Content"
        leadingIcon="arrow_back"
        trailingIcons={['help', 'settings']}
        onLeadingIconPress={() => console.log('Back pressed')}
        onTrailingIconPress={(icon) => console.log(`${icon} pressed`)}
        elevated={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Current Subscription Status */}
        <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 16 }}>
          <Card style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Typography variant="titleLarge" color="onSurface" style={{ flex: 1 }}>
                Current Plan
              </Typography>
              <View style={{
                backgroundColor: userSubscription.plan === 'free' ? colors.error : colors.primary,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Typography variant="bodySmall" color="onPrimary">
                  {userSubscription.plan.toUpperCase()}
                </Typography>
              </View>
            </View>

            {userSubscription.status === 'trial' && userSubscription.trialDaysLeft && (
              <View style={{ marginBottom: 12 }}>
                <Typography variant="bodyMedium" color="onSurface">
                  Trial Period
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  {userSubscription.trialDaysLeft} days remaining
                </Typography>
              </View>
            )}

            {userSubscription.nextBillingDate && (
              <Typography variant="bodySmall" color="onSurfaceVariant">
                Next billing: {userSubscription.nextBillingDate}
              </Typography>
            )}
          </Card>
        </View>

        {/* Upgrade Prompt for Free Users */}
        {userSubscription.plan === 'free' && (
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <UpgradePrompt onUpgrade={handleUpgradePress} />
          </View>
        )}

        {/* Subscription Plans */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Typography variant="titleLarge" color="onBackground" style={{ marginBottom: 16 }}>
            Subscription Plans
          </Typography>
          <SubscriptionPlans
            currentPlan={userSubscription.plan}
            onPlanSelect={handleUpgradePress}
          />
        </View>

        {/* Plan Comparison */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Typography variant="titleLarge" color="onBackground" style={{ marginBottom: 16 }}>
            Compare Plans
          </Typography>
          <PlanComparison currentPlan={userSubscription.plan} />
        </View>

        {/* Usage Analytics */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Typography variant="titleLarge" color="onBackground" style={{ marginBottom: 16 }}>
            Your Usage
          </Typography>
          <Card style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Typography variant="titleMedium" color="onSurface">
                  {usageStats.videosWatched}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  Videos Watched
                </Typography>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Typography variant="titleMedium" color="onSurface">
                  {usageStats.hoursWatched}h
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  Hours Watched
                </Typography>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Typography variant="titleMedium" color="onSurface">
                  {usageStats.downloadsUsed}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  Downloads
                </Typography>
              </View>
            </View>
          </Card>
        </View>

        {/* Premium Content Grid */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Typography variant="titleLarge" color="onBackground" style={{ marginBottom: 16 }}>
            Exclusive Content
          </Typography>
          {premiumContent.map((content) => (
            <PremiumContentCard key={content.id} content={content} />
          ))}
        </View>

        {/* Family Sharing */}
        {userSubscription.plan === 'family' && (
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <Typography variant="titleLarge" color="onBackground" style={{ marginBottom: 16 }}>
              Family Sharing
            </Typography>
            <Card style={{ padding: 16 }}>
              <Typography variant="bodyMedium" color="onSurface" style={{ marginBottom: 8 }}>
                Family Members ({userSubscription.familyMembers}/{userSubscription.maxFamilyMembers})
              </Typography>
              <SecondaryButton onPress={() => console.log('Manage family members')}>
                Manage Family
              </SecondaryButton>
            </Card>
          </View>
        )}

        {/* Billing Information */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Typography variant="titleLarge" color="onBackground" style={{ marginBottom: 16 }}>
            Billing & Account
          </Typography>
          <BillingInfo
            subscription={userSubscription}
            onManageBilling={handleManageBilling}
          />
        </View>

        {/* Premium Support */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Card style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Icon name="help" size={24} color={colors.primary} />
              <Typography variant="titleMedium" color="onSurface" style={{ marginLeft: 12 }}>
                Premium Support
              </Typography>
            </View>
            <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginBottom: 12 }}>
              Get priority support with faster response times and dedicated assistance.
            </Typography>
            <PrimaryButton onPress={() => console.log('Contact premium support')}>
              Contact Support
            </PrimaryButton>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};