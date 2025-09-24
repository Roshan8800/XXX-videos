import React, { useState } from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { ClickableCard, ElevatedCard } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms' | 'system';
  subject: string;
  content: string;
  isActive: boolean;
  lastModified: string;
  usageCount: number;
}

interface BroadcastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target: 'all' | 'premium' | 'active' | 'inactive';
  scheduledFor: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipientCount: number;
}

export const NotificationsManagement: React.FC = () => {
  const { colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'templates' | 'broadcast' | 'analytics'>('templates');
  const [searchQuery, setSearchQuery] = useState('');

  const notificationTemplates: NotificationTemplate[] = [
    {
      id: '1',
      name: 'Welcome Email',
      type: 'email',
      subject: 'Welcome to PlayNite!',
      content: 'Thank you for joining PlayNite. Start exploring our premium content library.',
      isActive: true,
      lastModified: '2024-01-10',
      usageCount: 1250,
    },
    {
      id: '2',
      name: 'Password Reset',
      type: 'email',
      subject: 'Reset Your Password',
      content: 'Click the link below to reset your password. Link expires in 24 hours.',
      isActive: true,
      lastModified: '2024-01-12',
      usageCount: 89,
    },
    {
      id: '3',
      name: 'New Content Alert',
      type: 'push',
      subject: 'New Content Available',
      content: 'Check out the latest videos from your favorite creators!',
      isActive: true,
      lastModified: '2024-01-14',
      usageCount: 567,
    },
    {
      id: '4',
      name: 'Maintenance Notice',
      type: 'system',
      subject: 'Scheduled Maintenance',
      content: 'We will be performing maintenance on January 20th from 2-4 AM EST.',
      isActive: false,
      lastModified: '2024-01-15',
      usageCount: 0,
    },
  ];

  const broadcastMessages: BroadcastMessage[] = [
    {
      id: '1',
      title: 'New Feature Launch',
      message: 'We\'ve added support for 4K streaming! Upgrade to premium to enjoy.',
      type: 'info',
      target: 'all',
      scheduledFor: '2024-01-16 10:00',
      status: 'scheduled',
      recipientCount: 12543,
    },
    {
      id: '2',
      title: 'Premium Discount',
      message: '50% off premium subscriptions this weekend only!',
      type: 'success',
      target: 'active',
      scheduledFor: '2024-01-15 09:00',
      status: 'sent',
      recipientCount: 8920,
    },
    {
      id: '3',
      title: 'Service Update',
      message: 'We\'ve improved our recommendation algorithm for better content discovery.',
      type: 'info',
      target: 'premium',
      scheduledFor: '2024-01-14 14:30',
      status: 'sent',
      recipientCount: 1247,
    },
  ];

  const getTypeColor = (type: NotificationTemplate['type']) => {
    switch (type) {
      case 'email': return colors.primary;
      case 'push': return colors.secondary;
      case 'sms': return colors.tertiary;
      case 'system': return colors.error;
      default: return colors.onSurfaceVariant;
    }
  };

  const getStatusColor = (status: BroadcastMessage['status']) => {
    switch (status) {
      case 'sent': return colors.primary;
      case 'scheduled': return colors.tertiary;
      case 'draft': return colors.outline;
      case 'failed': return colors.error;
      default: return colors.onSurfaceVariant;
    }
  };

  const getMessageTypeColor = (type: BroadcastMessage['type']) => {
    switch (type) {
      case 'success': return colors.primary;
      case 'warning': return '#ff9800';
      case 'error': return colors.error;
      case 'info': return colors.secondary;
      default: return colors.onSurfaceVariant;
    }
  };

  const filteredTemplates = notificationTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleCreateTemplate = () => {
    Alert.alert('Create Template', 'Template creation feature coming soon!');
  };

  const handleSendBroadcast = () => {
    Alert.alert('Send Broadcast', 'Broadcast feature coming soon!');
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    Alert.alert('Edit Template', `Editing: ${template.name}`);
  };

  const handleDeleteTemplate = (template: NotificationTemplate) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${template.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Delete template:', template.id)
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
          Notifications Management
        </Typography>
        <Typography variant="bodyLarge" color="onSurfaceVariant">
          Manage notification templates, broadcasts, and messaging systems
        </Typography>
      </View>

      {/* Stats Overview */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
      }}>
        <StatCard
          title="Active Templates"
          value="12"
          icon="description"
          color={colors.primary}
        />
        <StatCard
          title="Messages Sent"
          value="45.2K"
          icon="mail"
          color={colors.secondary}
        />
        <StatCard
          title="Delivery Rate"
          value="98.5%"
          icon="check_circle"
          color={colors.tertiary}
        />
        <StatCard
          title="Open Rate"
          value="24.3%"
          icon="visibility"
          color={colors.error}
        />
      </View>

      {/* Tab Navigation */}
      <ElevatedCard style={{ marginBottom: 24, padding: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['templates', 'broadcast', 'analytics'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: selectedTab === tab ? colors.primaryContainer : colors.surfaceVariant,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setSelectedTab(tab)}
            >
              <Typography
                variant="labelLarge"
                color={selectedTab === tab ? 'onPrimaryContainer' : 'onSurfaceVariant'}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </ElevatedCard>

      {/* Search */}
      <ElevatedCard style={{ marginBottom: 24, padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="search" size={20} color={colors.onSurfaceVariant} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: colors.onSurface,
            }}
            placeholder="Search templates..."
            placeholderTextColor={colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </ElevatedCard>

      {/* Templates Tab */}
      {selectedTab === 'templates' && (
        <ElevatedCard style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Typography variant="titleLarge" color="onSurface">
              Notification Templates
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
              onPress={handleCreateTemplate}
            >
              <Icon name="add" size={20} color={colors.onPrimary} />
              <Typography variant="labelMedium" color="onPrimary" style={{ marginLeft: 8 }}>
                New Template
              </Typography>
            </TouchableOpacity>
          </View>

          {filteredTemplates.map((template) => (
            <ClickableCard
              key={template.id}
              style={{
                padding: 16,
                marginBottom: 12,
                borderLeftWidth: 4,
                borderLeftColor: getTypeColor(template.type),
              }}
              onPress={() => handleEditTemplate(template)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Typography variant="titleMedium" color="onSurface">
                      {template.name}
                    </Typography>
                    <View style={{
                      backgroundColor: getTypeColor(template.type),
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 8,
                      marginLeft: 8,
                    }}>
                      <Typography variant="labelSmall" color="onPrimary">
                        {template.type.toUpperCase()}
                      </Typography>
                    </View>
                    {!template.isActive && (
                      <View style={{
                        backgroundColor: colors.error,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 8,
                        marginLeft: 8,
                      }}>
                        <Typography variant="labelSmall" color="onError">
                          INACTIVE
                        </Typography>
                      </View>
                    )}
                  </View>

                  <Typography variant="bodyMedium" color="onSurface" style={{ marginBottom: 4 }}>
                    {template.subject}
                  </Typography>

                  <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginBottom: 8 }}>
                    {template.content}
                  </Typography>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Typography variant="bodySmall" color="onSurfaceVariant">
                      Modified: {template.lastModified} • Used: {template.usageCount} times
                    </Typography>
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    padding: 8,
                    marginLeft: 12,
                  }}
                  onPress={() => handleDeleteTemplate(template)}
                >
                  <Icon name="delete" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </ClickableCard>
          ))}
        </ElevatedCard>
      )}

      {/* Broadcast Tab */}
      {selectedTab === 'broadcast' && (
        <ElevatedCard style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Typography variant="titleLarge" color="onSurface">
              Broadcast Messages
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
              onPress={handleSendBroadcast}
            >
              <Icon name="mail" size={20} color={colors.onPrimary} />
              <Typography variant="labelMedium" color="onPrimary" style={{ marginLeft: 8 }}>
                New Broadcast
              </Typography>
            </TouchableOpacity>
          </View>

          {broadcastMessages.map((message) => (
            <ClickableCard
              key={message.id}
              style={{
                padding: 16,
                marginBottom: 12,
                borderLeftWidth: 4,
                borderLeftColor: getMessageTypeColor(message.type),
              }}
              onPress={() => Alert.alert('Message Details', `Message: ${message.title}`)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Typography variant="titleMedium" color="onSurface">
                      {message.title}
                    </Typography>
                    <View style={{
                      backgroundColor: getStatusColor(message.status),
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 8,
                      marginLeft: 8,
                    }}>
                      <Typography variant="labelSmall" color="onPrimary">
                        {message.status.toUpperCase()}
                      </Typography>
                    </View>
                  </View>

                  <Typography variant="bodyMedium" color="onSurface" style={{ marginBottom: 4 }}>
                    {message.message}
                  </Typography>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Typography variant="bodySmall" color="onSurfaceVariant">
                      Target: {message.target} • Scheduled: {message.scheduledFor}
                    </Typography>
                  </View>

                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    Recipients: {message.recipientCount.toLocaleString()}
                  </Typography>
                </View>
              </View>
            </ClickableCard>
          ))}
        </ElevatedCard>
      )}

      {/* Analytics Tab */}
      {selectedTab === 'analytics' && (
        <ElevatedCard style={{ padding: 16 }}>
          <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
            Notification Analytics
          </Typography>

          <View style={{ marginBottom: 16 }}>
            <Typography variant="titleMedium" color="onSurface" style={{ marginBottom: 8 }}>
              Email Performance
            </Typography>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <View style={{ backgroundColor: colors.surfaceVariant, padding: 12, borderRadius: 8, flex: 1, minWidth: 150 }}>
                <Typography variant="bodySmall" color="onSurfaceVariant">Sent</Typography>
                <Typography variant="titleLarge" color="onSurface">45,231</Typography>
              </View>
              <View style={{ backgroundColor: colors.surfaceVariant, padding: 12, borderRadius: 8, flex: 1, minWidth: 150 }}>
                <Typography variant="bodySmall" color="onSurfaceVariant">Delivered</Typography>
                <Typography variant="titleLarge" color="onSurface">44,892</Typography>
              </View>
              <View style={{ backgroundColor: colors.surfaceVariant, padding: 12, borderRadius: 8, flex: 1, minWidth: 150 }}>
                <Typography variant="bodySmall" color="onSurfaceVariant">Opened</Typography>
                <Typography variant="titleLarge" color="onSurface">11,056</Typography>
              </View>
            </View>
          </View>

          <View>
            <Typography variant="titleMedium" color="onSurface" style={{ marginBottom: 8 }}>
              Push Notification Performance
            </Typography>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <View style={{ backgroundColor: colors.surfaceVariant, padding: 12, borderRadius: 8, flex: 1, minWidth: 150 }}>
                <Typography variant="bodySmall" color="onSurfaceVariant">Sent</Typography>
                <Typography variant="titleLarge" color="onSurface">23,456</Typography>
              </View>
              <View style={{ backgroundColor: colors.surfaceVariant, padding: 12, borderRadius: 8, flex: 1, minWidth: 150 }}>
                <Typography variant="bodySmall" color="onSurfaceVariant">Delivered</Typography>
                <Typography variant="titleLarge" color="onSurface">22,891</Typography>
              </View>
              <View style={{ backgroundColor: colors.surfaceVariant, padding: 12, borderRadius: 8, flex: 1, minWidth: 150 }}>
                <Typography variant="bodySmall" color="onSurfaceVariant">Clicked</Typography>
                <Typography variant="titleLarge" color="onSurface">5,678</Typography>
              </View>
            </View>
          </View>
        </ElevatedCard>
      )}
    </ScrollView>
  );
};