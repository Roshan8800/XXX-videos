import React, { useState } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import { ClickableCard, ElevatedCard } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';

const { width: screenWidth } = Dimensions.get('window');

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon, color }) => (
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

  const ChartBar: React.FC<{ data: ChartData[]; title: string; height?: number }> = ({
    data, title, height = 200
  }) => (
    <ElevatedCard style={{ marginBottom: 24, padding: 16 }}>
      <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
        {title}
      </Typography>

      <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        {data.map((item, index) => {
          const maxValue = Math.max(...data.map(d => d.value));
          const barHeight = (item.value / maxValue) * (height - 40);

          return (
            <View key={index} style={{ alignItems: 'center', flex: 1 }}>
              <View style={{
                height: barHeight,
                width: 24,
                backgroundColor: item.color,
                borderRadius: 4,
                marginBottom: 8,
              }} />
              <Typography variant="bodySmall" color="onSurfaceVariant">
                {item.label}
              </Typography>
              <Typography variant="bodySmall" color="onSurface">
                {item.value}
              </Typography>
            </View>
          );
        })}
      </View>
    </ElevatedCard>
  );

  const PieChart: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <ElevatedCard style={{ marginBottom: 24, padding: 16 }}>
        <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
          {title}
        </Typography>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 150, height: 150, marginRight: 24 }}>
            {/* Simple pie chart representation */}
            <View style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: colors.surfaceVariant,
              position: 'relative',
              overflow: 'hidden',
            }}>
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const angle = (percentage / 100) * 360;
                const startAngle = currentAngle;
                currentAngle += angle;

                return (
                  <View
                    key={index}
                    style={{
                      position: 'absolute',
                      width: 150,
                      height: 150,
                      backgroundColor: item.color,
                      transform: [
                        { rotate: `${startAngle}deg` },
                        { translateX: 75 },
                      ],
                      borderRadius: 75,
                      opacity: 0.8,
                    }}
                  />
                );
              })}
            </View>
          </View>

          <View style={{ flex: 1 }}>
            {data.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  borderRadius: 6,
                  marginRight: 8,
                }} />
                <Typography variant="bodyMedium" color="onSurface" style={{ flex: 1 }}>
                  {item.label}
                </Typography>
                <Typography variant="bodyMedium" color="onSurface">
                  {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </Typography>
              </View>
            ))}
          </View>
        </View>
      </ElevatedCard>
    );
  };

  const metrics = [
    {
      title: 'Total Views',
      value: '2.4M',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: 'visibility',
      color: colors.primary,
    },
    {
      title: 'Active Users',
      value: '45.2K',
      change: '+8.3%',
      changeType: 'positive' as const,
      icon: 'people',
      color: colors.secondary,
    },
    {
      title: 'Revenue',
      value: '$127K',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: 'trending_up',
      color: colors.tertiary,
    },
    {
      title: 'Engagement',
      value: '68%',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: 'thumb_up',
      color: colors.error,
    },
  ];

  const dailyViewsData: ChartData[] = [
    { label: 'Mon', value: 12500, color: colors.primary },
    { label: 'Tue', value: 15200, color: colors.primary },
    { label: 'Wed', value: 18900, color: colors.primary },
    { label: 'Thu', value: 22100, color: colors.primary },
    { label: 'Fri', value: 19800, color: colors.primary },
    { label: 'Sat', value: 25600, color: colors.primary },
    { label: 'Sun', value: 28900, color: colors.primary },
  ];

  const deviceData: ChartData[] = [
    { label: 'Mobile', value: 65, color: colors.primary },
    { label: 'Desktop', value: 28, color: colors.secondary },
    { label: 'Tablet', value: 7, color: colors.tertiary },
  ];

  const contentTypeData: ChartData[] = [
    { label: 'Videos', value: 72, color: colors.primary },
    { label: 'Images', value: 18, color: colors.secondary },
    { label: 'Audio', value: 10, color: colors.tertiary },
  ];

  const topContent = [
    { title: 'Epic Gaming Montage', views: '125K', engagement: '89%' },
    { title: 'Tutorial Series Ep.1', views: '98K', engagement: '76%' },
    { title: 'Funny Moments #47', views: '87K', engagement: '82%' },
    { title: 'Live Stream Highlights', views: '76K', engagement: '71%' },
    { title: 'Behind the Scenes', views: '65K', engagement: '68%' },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <Typography variant="headlineMedium" color="onBackground">
          Analytics & Reports
        </Typography>
        <Typography variant="bodyLarge" color="onSurfaceVariant">
          Comprehensive insights into platform performance and user engagement
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

      {/* Daily Views Chart */}
      <ChartBar data={dailyViewsData} title="Daily Views" height={200} />

      {/* Device and Content Type Breakdown */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <View style={{ width: '48%', minWidth: 300 }}>
          <PieChart data={deviceData} title="Device Distribution" />
        </View>
        <View style={{ width: '48%', minWidth: 300 }}>
          <PieChart data={contentTypeData} title="Content Types" />
        </View>
      </View>

      {/* Top Performing Content */}
      <ElevatedCard style={{ padding: 16 }}>
        <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
          Top Performing Content
        </Typography>

        {topContent.map((content, index) => (
          <ClickableCard
            key={index}
            style={{
              padding: 12,
              marginBottom: 8,
              borderLeftWidth: 3,
              borderLeftColor: colors.primary,
            }}
            onPress={() => console.log('View content details')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Typography variant="titleMedium" color="onSurface">
                  {content.title}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  {content.views} views • {content.engagement} engagement
                </Typography>
              </View>
              <View style={{
                backgroundColor: colors.primaryContainer,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Typography variant="labelSmall" color="onPrimaryContainer">
                  #{index + 1}
                </Typography>
              </View>
            </View>
          </ClickableCard>
        ))}
      </ElevatedCard>
    </ScrollView>
  );
};