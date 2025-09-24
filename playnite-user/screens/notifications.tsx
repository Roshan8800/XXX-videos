import React from 'react';
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, ClickableCard, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton, TextButton } from '../../shared/components/button';
import { AuthUtils, FirestoreUtils } from '../../shared/utils/firebase-utils';

interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'subscription' | 'content' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  videoId?: string;
  userId?: string;
}

interface NotificationSettings {
  likesComments: boolean;
  newFollowers: boolean;
  newContent: boolean;
  liveStreams: boolean;
  paymentConfirmations: boolean;
  subscriptionUpdates: boolean;
  videoReleases: boolean;
  creatorUpdates: boolean;
}

export const NotificationsScreen: React.FC = () => {
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = React.useState<'all' | 'settings'>('all');
  const [settings, setSettings] = React.useState<NotificationSettings>({
    likesComments: true,
    newFollowers: false,
    newContent: true,
    liveStreams: false,
    paymentConfirmations: true,
    subscriptionUpdates: true,
    videoReleases: false,
    creatorUpdates: true,
  });

  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: '1',
      type: 'like',
      title: 'New Like',
      message: 'John Doe liked your video "Midnight Passion"',
      timestamp: '2 minutes ago',
      read: false,
      actionable: true,
      videoId: 'video123',
    },
    {
      id: '2',
      type: 'comment',
      title: 'New Comment',
      message: 'Sarah Wilson commented on your video: "Amazing content! 🔥"',
      timestamp: '15 minutes ago',
      read: false,
      actionable: true,
      videoId: 'video123',
    },
    {
      id: '3',
      type: 'follow',
      title: 'New Follower',
      message: 'Alex Johnson started following you',
      timestamp: '1 hour ago',
      read: true,
      actionable: true,
      userId: 'user456',
    },
    {
      id: '4',
      type: 'subscription',
      title: 'Subscription Updated',
      message: 'Your premium subscription has been renewed successfully',
      timestamp: '2 hours ago',
      read: true,
      actionable: false,
    },
    {
      id: '5',
      type: 'content',
      title: 'New Content Available',
      message: 'StudioX has released new content in your favorite category',
      timestamp: '4 hours ago',
      read: true,
      actionable: true,
    },
    {
      id: '6',
      type: 'system',
      title: 'Account Security',
      message: 'New login detected from Chrome on Windows',
      timestamp: '1 day ago',
      read: true,
      actionable: false,
    },
  ]);

  const handleNotificationPress = async (notification: NotificationItem) => {
    if (!notification.read) {
      const updatedNotifications = notifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);

      // Save updated notifications to Firestore
      try {
        const user = AuthUtils.getCurrentUser();
        if (user) {
          await FirestoreUtils.updateDocument('userNotifications', user.uid, {
            notifications: updatedNotifications
          });
        }
      } catch (error) {
        console.error('Error updating notification status:', error);
      }
    }

    if (notification.actionable) {
      if (notification.videoId) {
        console.log('Navigate to video:', notification.videoId);
      } else if (notification.userId) {
        console.log('Navigate to user profile:', notification.userId);
      }
    }
  };

  const handleMarkAllRead = async () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);

    try {
      const user = AuthUtils.getCurrentUser();
      if (user) {
        await FirestoreUtils.updateDocument('userNotifications', user.uid, {
          notifications: updatedNotifications
        });
      }
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      Alert.alert('Error', 'Failed to mark notifications as read');
    }
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setNotifications([]);

            try {
              const user = AuthUtils.getCurrentUser();
              if (user) {
                await FirestoreUtils.updateDocument('userNotifications', user.uid, {
                  notifications: []
                });
              }
            } catch (error) {
              console.error('Error clearing notifications:', error);
            }
          }
        }
      ]
    );
  };

  const loadNotifications = async () => {
    try {
      const user = AuthUtils.getCurrentUser();
      if (!user) {
        console.log('No authenticated user');
        return;
      }

      // Load notifications from Firestore
      const userNotifications = await FirestoreUtils.getDocument('userNotifications', user.uid) as any;

      if (userNotifications && userNotifications.notifications) {
        setNotifications(userNotifications.notifications);
      }

      // Load notification preferences
      const profile = await FirestoreUtils.getDocument('users', user.uid) as any;
      if (profile && profile.preferences) {
        setSettings(prev => ({
          ...prev,
          likesComments: profile.preferences.likesComments !== false,
          newFollowers: profile.preferences.newFollowers || false,
          newContent: profile.preferences.newContent !== false,
          liveStreams: profile.preferences.liveStreams || false,
          paymentConfirmations: profile.preferences.paymentConfirmations !== false,
          subscriptionUpdates: profile.preferences.subscriptionUpdates !== false,
          videoReleases: profile.preferences.videoReleases || false,
          creatorUpdates: profile.preferences.creatorUpdates !== false,
        }));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotificationPreferences = async () => {
    try {
      const user = AuthUtils.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      await FirestoreUtils.updateDocument('users', user.uid, {
        preferences: settings
      });

      console.log('Notification preferences saved');
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      throw error;
    }
  };

  const handleSettingChange = async (setting: keyof NotificationSettings) => {
    const newSettings = { ...settings, [setting]: !settings[setting] };
    setSettings(newSettings);

    try {
      await saveNotificationPreferences();
    } catch (error) {
      console.error('Error saving setting:', error);
      // Revert the change if save failed
      setSettings(settings);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Load notifications on component mount
  React.useEffect(() => {
    loadNotifications();
  }, []);

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return 'favorite';
      case 'comment':
        return 'chat';
      case 'follow':
        return 'person_add';
      case 'subscription':
        return 'star';
      case 'content':
        return 'movie';
      case 'system':
        return 'info';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return '#ff6b6b';
      case 'comment':
        return '#4ecdc4';
      case 'follow':
        return '#45b7d1';
      case 'subscription':
        return '#f9ca24';
      case 'content':
        return '#6c5ce7';
      case 'system':
        return '#a29bfe';
      default:
        return colors.primary;
    }
  };

  const NotificationCard: React.FC<{ notification: NotificationItem }> = ({ notification }) => (
    <ClickableCard
      style={{
        padding: 16,
        marginBottom: 8,
        backgroundColor: notification.read ? colors.surface : colors.surfaceVariant,
        borderLeftWidth: 4,
        borderLeftColor: getNotificationColor(notification.type),
      }}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: getNotificationColor(notification.type) + '20',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Icon
            name={getNotificationIcon(notification.type) as any}
            size={20}
            color={getNotificationColor(notification.type)}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Typography
                variant="titleMedium"
                color="onSurface"
                style={{ fontWeight: notification.read ? '400' : '600' }}
              >
                {notification.title}
              </Typography>
              <Typography
                variant="bodyMedium"
                color="onSurfaceVariant"
                style={{ marginTop: 4 }}
                numberOfLines={2}
              >
                {notification.message}
              </Typography>
              <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginTop: 4 }}>
                {notification.timestamp}
              </Typography>
            </View>

            {!notification.read && (
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.primary,
                marginLeft: 8,
              }} />
            )}
          </View>
        </View>
      </View>
    </ClickableCard>
  );

  const NotificationSetting: React.FC<{
    title: string;
    description: string;
    setting: keyof NotificationSettings;
  }> = ({ title, description, setting }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    }}>
      <View style={{ flex: 1 }}>
        <Typography variant="titleMedium" color="onSurface">
          {title}
        </Typography>
        <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginTop: 2 }}>
          {description}
        </Typography>
      </View>

      <TouchableOpacity
        onPress={() => handleSettingChange(setting)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          backgroundColor: settings[setting] ? colors.primary : colors.surfaceVariant,
          justifyContent: 'center',
          alignItems: settings[setting] ? 'flex-end' : 'flex-start',
          paddingHorizontal: 2,
        }}
      >
        <View style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: colors.onPrimary,
        }} />
      </TouchableOpacity>
    </View>
  );

  const renderNotificationsList = () => (
    <View style={{ flex: 1 }}>
      {/* Header Actions */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineVariant,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Typography variant="titleLarge" color="onSurface">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}>
              <Typography variant="labelSmall" color="onPrimary">
                {unreadCount}
              </Typography>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextButton onPress={handleMarkAllRead} disabled={unreadCount === 0}>
            <Typography variant="bodyMedium" color={unreadCount === 0 ? 'onSurfaceVariant' : 'primary'}>
              Mark all read
            </Typography>
          </TextButton>
          <TextButton onPress={handleClearAll} disabled={notifications.length === 0}>
            <Typography variant="bodyMedium" color={notifications.length === 0 ? 'onSurfaceVariant' : 'error'}>
              Clear all
            </Typography>
          </TextButton>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {notifications.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 64 }}>
            <Icon name="notifications_none" size={64} color={colors.onSurfaceVariant} />
            <Typography variant="headlineSmall" color="onSurfaceVariant" style={{ marginTop: 16 }}>
              No notifications
            </Typography>
            <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ marginTop: 8 }}>
              You're all caught up! New notifications will appear here.
            </Typography>
          </View>
        ) : (
          notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderSettings = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View style={{ paddingHorizontal: 16 }}>
        <Typography variant="headlineLarge" color="onBackground" style={{ marginTop: 24, marginBottom: 24 }}>
          Notification Settings
        </Typography>
        <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ marginBottom: 32 }}>
          Manage your notification preferences to stay updated with what matters most to you.
        </Typography>

        {/* Push Notifications */}
        <ElevatedCard style={{ marginBottom: 24 }}>
          <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
            Push Notifications
          </Typography>

          <NotificationSetting
            title="Likes and Comments"
            description="Get notified when someone likes or comments on your content"
            setting="likesComments"
          />

          <NotificationSetting
            title="New Followers"
            description="Receive alerts when someone starts following you"
            setting="newFollowers"
          />

          <NotificationSetting
            title="New Content from Creators"
            description="Be notified when a creator you follow posts new content"
            setting="newContent"
          />

          <NotificationSetting
            title="Live Stream Notifications"
            description="Get alerts for live streams from creators you follow"
            setting="liveStreams"
          />
        </ElevatedCard>

        {/* Transactional Alerts */}
        <ElevatedCard style={{ marginBottom: 24 }}>
          <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
            Transactional Alerts
          </Typography>

          <NotificationSetting
            title="Payment Confirmations"
            description="Receive notifications for successful payments"
            setting="paymentConfirmations"
          />

          <NotificationSetting
            title="Subscription Updates"
            description="Get alerts for subscription renewals and changes"
            setting="subscriptionUpdates"
          />
        </ElevatedCard>

        {/* Content Updates */}
        <ElevatedCard style={{ marginBottom: 24 }}>
          <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
            Content Updates
          </Typography>

          <NotificationSetting
            title="New Video Releases"
            description="Be notified about new video releases and updates"
            setting="videoReleases"
          />

          <NotificationSetting
            title="Creator Content Updates"
            description="Receive alerts for new creator content and updates"
            setting="creatorUpdates"
          />
        </ElevatedCard>

        {/* Save Button */}
        <PrimaryButton
          onPress={async () => {
            try {
              await saveNotificationPreferences();
              Alert.alert('Settings Saved', 'Your notification preferences have been updated.');
            } catch (error) {
              Alert.alert('Error', 'Failed to save notification preferences.');
            }
          }}
          style={{ marginTop: 16 }}
        >
          Save Preferences
        </PrimaryButton>
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title="Notifications"
        leadingIcon="arrow_back"
        onLeadingIconPress={() => console.log('Back pressed')}
        elevated={true}
      />

      {/* Tab Navigation */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineVariant,
      }}>
        <TouchableOpacity
          onPress={() => setActiveTab('all')}
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: activeTab === 'all' ? 2 : 0,
            borderBottomColor: activeTab === 'all' ? colors.primary : 'transparent',
          }}
        >
          <Typography
            variant="titleMedium"
            color={activeTab === 'all' ? 'primary' : 'onSurfaceVariant'}
          >
            All ({notifications.length})
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('settings')}
          style={{
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            borderBottomWidth: activeTab === 'settings' ? 2 : 0,
            borderBottomColor: activeTab === 'settings' ? colors.primary : 'transparent',
          }}
        >
          <Typography
            variant="titleMedium"
            color={activeTab === 'settings' ? 'primary' : 'onSurfaceVariant'}
          >
            Settings
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'all' ? renderNotificationsList() : renderSettings()}
    </View>
  );
};