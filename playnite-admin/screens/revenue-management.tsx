import React, { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { ClickableCard, ElevatedCard } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';

interface Transaction {
  id: string;
  user: string;
  type: 'subscription' | 'one_time' | 'refund';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  description: string;
  paymentMethod: string;
}

interface RevenueMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
}

export const RevenueManagement: React.FC = () => {
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const transactions: Transaction[] = [
    {
      id: '1',
      user: 'john.doe@example.com',
      type: 'subscription',
      amount: 9.99,
      currency: 'USD',
      status: 'completed',
      date: '2024-01-15 14:30',
      description: 'Premium Monthly Subscription',
      paymentMethod: 'Credit Card',
    },
    {
      id: '2',
      user: 'jane.smith@example.com',
      type: 'one_time',
      amount: 4.99,
      currency: 'USD',
      status: 'completed',
      date: '2024-01-15 13:45',
      description: 'Video Download',
      paymentMethod: 'PayPal',
    },
    {
      id: '3',
      user: 'mike.johnson@example.com',
      type: 'refund',
      amount: -9.99,
      currency: 'USD',
      status: 'refunded',
      date: '2024-01-15 12:20',
      description: 'Subscription Refund',
      paymentMethod: 'Credit Card',
    },
    {
      id: '4',
      user: 'sarah.wilson@example.com',
      type: 'subscription',
      amount: 9.99,
      currency: 'USD',
      status: 'pending',
      date: '2024-01-15 11:10',
      description: 'Premium Monthly Subscription',
      paymentMethod: 'Credit Card',
    },
  ];

  const filters = [
    { id: 'all', name: 'All Transactions', count: transactions.length },
    { id: 'subscription', name: 'Subscriptions', count: transactions.filter(t => t.type === 'subscription').length },
    { id: 'one_time', name: 'One-time', count: transactions.filter(t => t.type === 'one_time').length },
    { id: 'refund', name: 'Refunds', count: transactions.filter(t => t.type === 'refund').length },
  ];

  const statuses = [
    { id: 'completed', name: 'Completed', count: transactions.filter(t => t.status === 'completed').length },
    { id: 'pending', name: 'Pending', count: transactions.filter(t => t.status === 'pending').length },
    { id: 'failed', name: 'Failed', count: transactions.filter(t => t.status === 'failed').length },
    { id: 'refunded', name: 'Refunded', count: transactions.filter(t => t.status === 'refunded').length },
  ];

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return colors.primary;
      case 'pending': return colors.tertiary;
      case 'failed': return colors.error;
      case 'refunded': return '#ff9800';
      default: return colors.onSurfaceVariant;
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'subscription': return colors.primary;
      case 'one_time': return colors.secondary;
      case 'refund': return colors.error;
      default: return colors.onSurfaceVariant;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = selectedFilter === 'all' || transaction.type === selectedFilter;
    return matchesFilter;
  });

  const MetricCard: React.FC<{ title: string; value: string; change: string; changeType: 'positive' | 'negative' | 'neutral'; icon: string; color: string }> = ({
    title, value, change, changeType, icon, color
  }) => (
    <ElevatedCard style={{ flex: 1, marginHorizontal: 4, padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: color + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
          <Icon
            name={icon as any}
            size={24}
            color={color}
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

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon
          name={changeType === 'positive' ? 'trending_up' : changeType === 'negative' ? 'error' : 'help'}
          size={16}
          color={changeType === 'positive' ? colors.primary : changeType === 'negative' ? colors.error : colors.onSurfaceVariant}
        />
        <Typography
          variant="bodySmall"
          color={changeType === 'positive' ? 'primary' : changeType === 'negative' ? 'error' : 'onSurfaceVariant'}
          style={{ marginLeft: 4 }}
        >
          {change} from last period
        </Typography>
      </View>
    </ElevatedCard>
  );

  const metrics: RevenueMetric[] = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+23.1%',
      changeType: 'positive',
      icon: 'trending_up',
      color: colors.primary,
    },
    {
      title: 'Monthly Recurring',
      value: '$32,450',
      change: '+18.5%',
      changeType: 'positive',
      icon: 'sync',
      color: colors.secondary,
    },
    {
      title: 'One-time Purchases',
      value: '$12,781',
      change: '+8.2%',
      changeType: 'positive',
      icon: 'shopping_cart',
      color: colors.tertiary,
    },
    {
      title: 'Refund Rate',
      value: '2.3%',
      change: '-0.5%',
      changeType: 'positive',
      icon: 'undo',
      color: colors.error,
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
          Revenue Management
        </Typography>
        <Typography variant="bodyLarge" color="onSurfaceVariant">
          Track payments, subscriptions, and financial performance
        </Typography>
      </View>

      {/* Time Period Selector */}
      <ElevatedCard style={{ marginBottom: 24, padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="titleLarge" color="onSurface">
            Time Period
          </Typography>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['7d', '30d', '90d'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedPeriod === period ? colors.primary : colors.surfaceVariant,
                }}
                onPress={() => setSelectedPeriod(period)}
              >
                <Typography
                  variant="labelMedium"
                  color={selectedPeriod === period ? 'onPrimary' : 'onSurfaceVariant'}
                >
                  {period.toUpperCase()}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ElevatedCard>

      {/* Key Metrics */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
      }}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </View>

      {/* Filters */}
      <ElevatedCard style={{ marginBottom: 24, padding: 16 }}>
        <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
          Filter Transactions
        </Typography>

        {/* Transaction Type Filters */}
        <View style={{ marginBottom: 16 }}>
          <Typography variant="titleSmall" color="onSurface" style={{ marginBottom: 8 }}>
            Transaction Type
          </Typography>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: selectedFilter === filter.id ? colors.primaryContainer : colors.surfaceVariant,
                }}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Typography
                  variant="labelMedium"
                  color={selectedFilter === filter.id ? 'onPrimaryContainer' : 'onSurfaceVariant'}
                >
                  {filter.name} ({filter.count})
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status Overview */}
        <View>
          <Typography variant="titleSmall" color="onSurface" style={{ marginBottom: 8 }}>
            Status Overview
          </Typography>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {statuses.map((status) => (
              <View
                key={status.id}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: colors.surfaceVariant,
                }}
              >
                <Typography variant="labelMedium" color="onSurfaceVariant">
                  {status.name}: {status.count}
                </Typography>
              </View>
            ))}
          </View>
        </View>
      </ElevatedCard>

      {/* Transaction List */}
      <ElevatedCard style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Typography variant="titleLarge" color="onSurface">
            Recent Transactions
          </Typography>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: colors.primary,
              borderRadius: 8,
            }}
            onPress={() => Alert.alert('Export', 'Export transactions feature coming soon!')}
          >
            <Icon name="download" size={20} color={colors.onPrimary} />
            <Typography variant="labelMedium" color="onPrimary" style={{ marginLeft: 8 }}>
              Export
            </Typography>
          </TouchableOpacity>
        </View>

        {filteredTransactions.map((transaction) => (
          <ClickableCard
            key={transaction.id}
            style={{
              padding: 16,
              marginBottom: 12,
              borderLeftWidth: 4,
              borderLeftColor: getTypeColor(transaction.type),
            }}
            onPress={() => Alert.alert('Transaction Details', `Transaction: ${transaction.id}`)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Typography variant="titleMedium" color="onSurface">
                    {transaction.description}
                  </Typography>
                  <View style={{
                    backgroundColor: getStatusColor(transaction.status),
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 8,
                    marginLeft: 8,
                  }}>
                    <Typography variant="labelSmall" color="onPrimary">
                      {transaction.status.toUpperCase()}
                    </Typography>
                  </View>
                </View>

                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  {transaction.user}
                </Typography>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    {transaction.date} • {transaction.paymentMethod}
                  </Typography>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Typography
                  variant="titleMedium"
                  color={transaction.amount < 0 ? colors.error : 'onSurface'}
                >
                  {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  {transaction.currency}
                </Typography>
              </View>
            </View>
          </ClickableCard>
        ))}
      </ElevatedCard>
    </ScrollView>
  );
};