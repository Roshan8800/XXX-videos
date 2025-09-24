import React, { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { ClickableCard, ElevatedCard } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';

interface ModerationItem {
  id: string;
  title: string;
  type: 'video' | 'image' | 'comment' | 'user';
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reportedBy: string;
  reason: string;
  reportDate: string;
  content: string;
  thumbnail?: string;
  reporterCount: number;
}

export const ContentModeration: React.FC = () => {
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'flagged' | 'urgent'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const moderationItems: ModerationItem[] = [
    {
      id: '1',
      title: 'Inappropriate Gaming Content',
      type: 'video',
      status: 'pending',
      priority: 'high',
      reportedBy: 'user123',
      reason: 'Contains inappropriate language and violence',
      reportDate: '2024-01-15 14:30',
      content: 'Gaming video with excessive profanity and graphic content',
      reporterCount: 3,
    },
    {
      id: '2',
      title: 'Spam Comment',
      type: 'comment',
      status: 'flagged',
      priority: 'low',
      reportedBy: 'moderator456',
      reason: 'Automated spam detection triggered',
      reportDate: '2024-01-15 13:45',
      content: 'Buy cheap followers! Link in bio...',
      reporterCount: 1,
    },
    {
      id: '3',
      title: 'Hate Speech',
      type: 'comment',
      status: 'pending',
      priority: 'urgent',
      reportedBy: 'user789',
      reason: 'Contains hate speech and discriminatory content',
      reportDate: '2024-01-15 12:20',
      content: 'This is absolutely disgusting and offensive...',
      reporterCount: 7,
    },
    {
      id: '4',
      title: 'Copyright Violation',
      type: 'video',
      status: 'pending',
      priority: 'medium',
      reportedBy: 'content_owner',
      reason: 'Unauthorized use of copyrighted material',
      reportDate: '2024-01-15 11:10',
      content: 'Music video using copyrighted audio without permission',
      reporterCount: 1,
    },
  ];

  const types = [
    { id: 'all', name: 'All Types', count: moderationItems.length },
    { id: 'video', name: 'Videos', count: moderationItems.filter(i => i.type === 'video').length },
    { id: 'comment', name: 'Comments', count: moderationItems.filter(i => i.type === 'comment').length },
    { id: 'image', name: 'Images', count: moderationItems.filter(i => i.type === 'image').length },
    { id: 'user', name: 'Users', count: moderationItems.filter(i => i.type === 'user').length },
  ];

  const filters = [
    { id: 'all', name: 'All Items', count: moderationItems.length },
    { id: 'pending', name: 'Pending', count: moderationItems.filter(i => i.status === 'pending').length },
    { id: 'flagged', name: 'Flagged', count: moderationItems.filter(i => i.status === 'flagged').length },
    { id: 'urgent', name: 'Urgent', count: moderationItems.filter(i => i.priority === 'urgent').length },
  ];

  const getPriorityColor = (priority: ModerationItem['priority']) => {
    switch (priority) {
      case 'urgent': return colors.error;
      case 'high': return '#ff9800';
      case 'medium': return colors.tertiary;
      case 'low': return colors.outline;
      default: return colors.onSurfaceVariant;
    }
  };

  const getStatusColor = (status: ModerationItem['status']) => {
    switch (status) {
      case 'pending': return colors.tertiary;
      case 'approved': return colors.primary;
      case 'rejected': return colors.error;
      case 'flagged': return '#ff9800';
      default: return colors.onSurfaceVariant;
    }
  };

  const filteredItems = moderationItems.filter(item => {
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'pending' && item.status === 'pending') ||
                         (selectedFilter === 'flagged' && item.status === 'flagged') ||
                         (selectedFilter === 'urgent' && item.priority === 'urgent');
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesFilter && matchesType;
  });

  const StatCard: React.FC<{ title: string; value: string; icon: string; color?: string }> = ({
    title, value, icon, color
  }) => (
    <ElevatedCard style={{ flex: 1, marginHorizontal: 4, padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color || colors.primaryContainer,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
          <Icon
            name={icon as any}
            size={20}
            color={color ? colors.onPrimary : colors.onPrimaryContainer}
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
    </ElevatedCard>
  );

  const handleModerationAction = (item: ModerationItem, action: 'approve' | 'reject' | 'flag') => {
    const actionText = action === 'approve' ? 'approve' : action === 'reject' ? 'reject' : 'flag';
    Alert.alert(
      `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Content`,
      `Are you sure you want to ${actionText} this content?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionText.charAt(0).toUpperCase() + actionText.slice(1),
          onPress: () => {
            console.log(`${actionText} item:`, item.id);
            // Here you would typically call an API to update the moderation status
          }
        }
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <Typography variant="headlineMedium" color="onBackground">
          Content Moderation
        </Typography>
        <Typography variant="bodyLarge" color="onSurfaceVariant">
          Review and moderate reported content, comments, and user behavior
        </Typography>
      </View>

      {/* Stats Overview */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
      }}>
        <StatCard
          title="Pending Reviews"
          value="24"
          icon="schedule"
          color={colors.tertiary}
        />
        <StatCard
          title="Urgent Items"
          value="5"
          icon="warning"
          color={colors.error}
        />
        <StatCard
          title="Flagged Content"
          value="12"
          icon="flag"
          color="#ff9800"
        />
        <StatCard
          title="Resolved Today"
          value="47"
          icon="check_circle"
          color={colors.primary}
        />
      </View>

      {/* Filters */}
      <ElevatedCard style={{ marginBottom: 24, padding: 16 }}>
        <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
          Filter Queue
        </Typography>

        {/* Status Filters */}
        <View style={{ marginBottom: 16 }}>
          <Typography variant="titleSmall" color="onSurface" style={{ marginBottom: 8 }}>
            Status
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
                onPress={() => setSelectedFilter(filter.id as any)}
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

        {/* Type Filters */}
        <View>
          <Typography variant="titleSmall" color="onSurface" style={{ marginBottom: 8 }}>
            Content Type
          </Typography>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {types.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: selectedType === type.id ? colors.primaryContainer : colors.surfaceVariant,
                }}
                onPress={() => setSelectedType(type.id)}
              >
                <Typography
                  variant="labelMedium"
                  color={selectedType === type.id ? 'onPrimaryContainer' : 'onSurfaceVariant'}
                >
                  {type.name} ({type.count})
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ElevatedCard>

      {/* Moderation Queue */}
      <ElevatedCard style={{ padding: 16 }}>
        <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
          Moderation Queue
        </Typography>

        {filteredItems.map((item) => (
          <ClickableCard
            key={item.id}
            style={{
              padding: 16,
              marginBottom: 12,
              borderLeftWidth: 4,
              borderLeftColor: getPriorityColor(item.priority),
            }}
            onPress={() => Alert.alert('Content Details', `Reviewing: ${item.title}`)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 8,
                backgroundColor: colors.surfaceVariant,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Icon
                  name={item.type === 'video' ? 'video_library' : item.type === 'comment' ? 'chat' : 'image'}
                  size={24}
                  color={colors.onSurfaceVariant}
                />
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Typography variant="titleMedium" color="onSurface">
                    {item.title}
                  </Typography>
                  <View style={{
                    backgroundColor: getPriorityColor(item.priority),
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 8,
                    marginLeft: 8,
                  }}>
                    <Typography variant="labelSmall" color="onPrimary">
                      {item.priority.toUpperCase()}
                    </Typography>
                  </View>
                </View>

                <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginBottom: 4 }}>
                  {item.content}
                </Typography>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Icon name="person" size={16} color={colors.onSurfaceVariant} />
                  <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginLeft: 4 }}>
                    Reported by {item.reportedBy}
                  </Typography>
                  <Icon name="info" size={16} color={colors.onSurfaceVariant} style={{ marginLeft: 12 }} />
                  <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginLeft: 4 }}>
                    {item.reportDate}
                  </Typography>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Icon name="info" size={16} color={colors.onSurfaceVariant} />
                  <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginLeft: 4 }}>
                    {item.reason}
                  </Typography>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="error" size={16} color={colors.onSurfaceVariant} />
                    <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginLeft: 4 }}>
                      {item.reporterCount} reports
                    </Typography>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor: colors.primary,
                        borderRadius: 6,
                      }}
                      onPress={() => handleModerationAction(item, 'approve')}
                    >
                      <Typography variant="labelSmall" color="onPrimary">
                        Approve
                      </Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor: colors.error,
                        borderRadius: 6,
                      }}
                      onPress={() => handleModerationAction(item, 'reject')}
                    >
                      <Typography variant="labelSmall" color="onError">
                        Reject
                      </Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor: '#ff9800',
                        borderRadius: 6,
                      }}
                      onPress={() => handleModerationAction(item, 'flag')}
                    >
                      <Typography variant="labelSmall" color="onPrimary">
                        Flag
                      </Typography>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ClickableCard>
        ))}
      </ElevatedCard>
    </ScrollView>
  );
};