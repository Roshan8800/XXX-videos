import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, ClickableCard, PlayNiteFooter } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  const { colors } = useTheme();

  return (
    <ElevatedCard style={{ flex: 1, marginHorizontal: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.primaryContainer,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
          <Icon
            name={icon as any}
            size={24}
            color={colors.onPrimaryContainer}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Typography variant="titleMedium" color="onSurface">
            {title}
          </Typography>
          <Typography variant="displaySmall" color="onSurface">
            {value}
          </Typography>
        </View>
      </View>

      {trend && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            name="trending_up"
            size={16}
            color={trend.isPositive ? colors.primary : colors.error}
          />
          <Typography
            variant="bodySmall"
            color={trend.isPositive ? 'primary' : 'error'}
            style={{ marginLeft: 4 }}
          >
            {trend.value}% from last month
          </Typography>
        </View>
      )}
    </ElevatedCard>
  );
};

export const AdminDashboard: React.FC = () => {
  const { colors } = useTheme();

  const stats = [
    {
      title: 'Total Users',
      value: '12,543',
      icon: 'people',
      trend: { value: 12.5, isPositive: true },
    },
    {
      title: 'Active Videos',
      value: '8,429',
      icon: 'video_library',
      trend: { value: 8.2, isPositive: true },
    },
    {
      title: 'Revenue',
      value: '$45,231',
      icon: 'trending_up',
      trend: { value: 23.1, isPositive: true },
    },
    {
      title: 'Views Today',
      value: '156,789',
      icon: 'visibility',
      trend: { value: 5.4, isPositive: false },
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New user registered',
      user: 'john.doe@example.com',
      time: '2 minutes ago',
      icon: 'person_add',
    },
    {
      id: 2,
      action: 'Video uploaded',
      user: 'content.creator@example.com',
      time: '5 minutes ago',
      icon: 'video_library',
    },
    {
      id: 3,
      action: 'Payment processed',
      user: 'premium.user@example.com',
      time: '12 minutes ago',
      icon: 'payment',
    },
    {
      id: 4,
      action: 'Content flagged',
      user: 'moderator@example.com',
      time: '1 hour ago',
      icon: 'flag',
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <Typography variant="headlineMedium" color="onBackground">
          Dashboard
        </Typography>
        <Typography variant="bodyLarge" color="onSurfaceVariant">
          Welcome back! Here's what's happening with PlayNite.
        </Typography>
      </View>

      {/* Stats Grid */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
      }}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </View>

      {/* Recent Activity */}
      <ElevatedCard style={{ marginBottom: 24 }}>
        <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
          Recent Activity
        </Typography>

        {recentActivities.map((activity) => (
          <View
            key={activity.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: colors.outlineVariant,
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.surfaceVariant,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}>
              <Icon
                name={activity.icon as any}
                size={20}
                color={colors.onSurfaceVariant}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Typography variant="bodyLarge" color="onSurface">
                {activity.action}
              </Typography>
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                {activity.user}
              </Typography>
            </View>

            <Typography variant="bodySmall" color="onSurfaceVariant">
              {activity.time}
            </Typography>
          </View>
        ))}
      </ElevatedCard>

      {/* Quick Actions */}
      <ElevatedCard>
        <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
          Quick Actions
        </Typography>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <ClickableCard
            style={{
              flex: 1,
              minWidth: 120,
              alignItems: 'center',
              padding: 16,
            }}
            onPress={() => console.log('Add content')}
          >
            <Icon name="add" size={24} color={colors.primary} />
            <Typography variant="labelLarge" color="primary" style={{ marginTop: 8 }}>
              Add Content
            </Typography>
          </ClickableCard>

          <ClickableCard
            style={{
              flex: 1,
              minWidth: 120,
              alignItems: 'center',
              padding: 16,
            }}
            onPress={() => console.log('Manage users')}
          >
            <Icon name="people" size={24} color={colors.primary} />
            <Typography variant="labelLarge" color="primary" style={{ marginTop: 8 }}>
              Manage Users
            </Typography>
          </ClickableCard>

          <ClickableCard
            style={{
              flex: 1,
              minWidth: 120,
              alignItems: 'center',
              padding: 16,
            }}
            onPress={() => console.log('View analytics')}
          >
            <Icon name="analytics" size={24} color={colors.primary} />
            <Typography variant="labelLarge" color="primary" style={{ marginTop: 8 }}>
              Analytics
            </Typography>
          </ClickableCard>

          <ClickableCard
            style={{
              flex: 1,
              minWidth: 120,
              alignItems: 'center',
              padding: 16,
            }}
            onPress={() => console.log('Settings')}
          >
            <Icon name="settings" size={24} color={colors.primary} />
            <Typography variant="labelLarge" color="primary" style={{ marginTop: 8 }}>
              Settings
            </Typography>
          </ClickableCard>
        </View>
      </ElevatedCard>

      {/* PlayNite Footer */}
      <PlayNiteFooter
        showBranding={false}
        onPrivacyPress={() => console.log('Privacy pressed')}
        onTermsPress={() => console.log('Terms pressed')}
        onSupportPress={() => console.log('Support pressed')}
      />
    </ScrollView>
  );
};