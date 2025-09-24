import React from 'react';
import { Image, ScrollView, TouchableOpacity, View, FlatList } from 'react-native';
import { AppBar } from '../../shared/components';
import { SecondaryButton, TextButton } from '../../shared/components/button';
import { Icon } from '../../shared/utils/icons';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';

interface ContinueWatchingItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  progress: number; // 0-100
  timeRemaining: string;
  episodeInfo?: string;
  seasonInfo?: string;
  contentType: 'movie' | 'tv_show' | 'documentary' | 'other';
  lastWatched: string;
  isAvailableOffline?: boolean;
  isMature?: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

export const ContinueWatchingScreen: React.FC = () => {
  const { colors } = useTheme();

  const [continueWatchingItems, setContinueWatchingItems] = React.useState<ContinueWatchingItem[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'recent' | 'progress' | 'type'>('recent');

  // Mock data - in real app this would come from API/database
  const mockContinueWatchingItems: ContinueWatchingItem[] = [
    {
      id: '1',
      title: 'Passionate Encounter',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG3kuGah_A3v8zGxOH_n5RHxLNF9wuW-nSGDHSfWuOS8rs3Zb9DaE4FY-SHjbpmasr701QvdGy0qVz7x0H4O7NqW8Y4xYMCcfNjQJDUMScko9yokL43xDV7VGpeyL5ck5R72ZRMaAXDercigEG60CDZCAsXh6LiJE9_TVXDvyo-0m0FrjDCtbKZhi5tEVIC9x0eLpBdiCwrc2wNfwOJeuB7aJEEQThwTEKm3LUdApwVY4--J1HT4JvhObA4cVddDrFrNuP_y-oVlw',
      duration: '12:34',
      progress: 65,
      timeRemaining: '4:18',
      contentType: 'movie',
      lastWatched: '2 hours ago',
      isAvailableOffline: true,
    },
    {
      id: '2',
      title: 'Secret Desires',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-rVtg-4C9jfvrmsAv6qoZRpgzd_fNVYL_0uAl3EN7lM1GRSgh4akTkvSbNM9aL649XGNRJyrQmer-rzMvy8uo9_L8OtZ8POP75DYUm1OjVxyWzRLbJGJbskRY0zOJJb--Gqz9vThBhBdhGuUrI3gpZHkWaEzaIQCfzqgot1k3_rnNxD9Sr6ydt4q79x5Zo77-zqoWralkA24EVvZucmbv7NwwEZI1eJNhoI1TDYWNxNDSs3qEyuwBNnNlVRFxtqWg3lNhaweofNg',
      duration: '45:20',
      progress: 30,
      timeRemaining: '31:36',
      episodeInfo: 'Episode 3',
      seasonInfo: 'Season 2',
      contentType: 'tv_show',
      lastWatched: '1 day ago',
      isMature: true,
    },
    {
      id: '3',
      title: 'Behind the Scenes',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPahh15vMeCtREUyoZIIFA6ox7bh7pVOyRtshPSnPkwxABp1S3S1snCGMgZaB9Eo01bbWPC43FV6SRFyxc1qRFh3nCc2EgYjuN0YaPk1H0J1oQ9XR9nfwzSBPZt0nYnO8Y8wIo4JFSpkeQLInieUn9UoKjH4J4mF66ykK6mfSN9g0WAbNEXx2SJt4iWFk-i_CeEz0cCVe3acjIK5LNTpHSgAynkrCbZHw8RO_ER-JJlQODL7cLE9eD7n1mCloksqhVOBMhYKrOGxw',
      duration: '28:15',
      progress: 85,
      timeRemaining: '4:14',
      contentType: 'documentary',
      lastWatched: '3 days ago',
    },
    {
      id: '4',
      title: 'Intimate Moments',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOta7-915iHTQIwlQTtimgzw6XW-A73WD2vt86Tbqi37TwhS3G7qqvgdG6niWltaJaw6BV2GRJiFrYTZQaDzS8b2SwxQIYQ6-jQ8M7rNIoWz2rxkWU5A6LSNxFMizmUOwOpv5lwtvj8Ye2Wqfz8sdiOlCXRnuau53BSUqNkzmjM5lgrowZotp70qr3tRFPzim1RZBWxCsd8GPrQA7IhIr0HMbuoGA6PVWlACVYMlmenleXnQaYRs8QCYwWzSsVFRLkGiKJ8cmgq4I',
      duration: '18:45',
      progress: 10,
      timeRemaining: '16:54',
      contentType: 'movie',
      lastWatched: '5 days ago',
      isAvailableOffline: false,
    },
  ];

  React.useEffect(() => {
    setContinueWatchingItems(mockContinueWatchingItems);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleResumePress = (item: ContinueWatchingItem) => {
    console.log('Resume playback:', item.title);
    // Navigate to video playback screen
  };

  const handleItemPress = (item: ContinueWatchingItem) => {
    console.log('Open content details:', item.title);
  };

  const handleQuickAction = (action: string, itemId: string) => {
    console.log(`${action} for item:`, itemId);
  };

  const sortItems = (items: ContinueWatchingItem[]) => {
    switch (sortBy) {
      case 'recent':
        return items.sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime());
      case 'progress':
        return items.sort((a, b) => b.progress - a.progress);
      case 'type':
        return items.sort((a, b) => a.contentType.localeCompare(b.contentType));
      default:
        return items;
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'movie':
        return 'movie';
      case 'tv_show':
        return 'video_library';
      case 'documentary':
        return 'info';
      default:
        return 'play_circle';
    }
  };

  const getContentTypeLabel = (contentType: string) => {
    switch (contentType) {
      case 'movie':
        return 'Movie';
      case 'tv_show':
        return 'TV Show';
      case 'documentary':
        return 'Documentary';
      default:
        return 'Video';
    }
  };

  const ContinueWatchingCard: React.FC<{ item: ContinueWatchingItem }> = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      {/* Thumbnail with Progress Overlay */}
      <View style={{ position: 'relative', marginRight: 16 }}>
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            width: 120,
            height: 80,
            borderRadius: 8,
          }}
          resizeMode="cover"
        />

        {/* Progress Bar */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: 2,
        }}>
          <View style={{
            height: '100%',
            width: `${item.progress}%`,
            backgroundColor: colors.primary,
            borderRadius: 2,
          }} />
        </View>

        {/* Duration Badge */}
        <View style={{
          position: 'absolute',
          top: 4,
          right: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4,
        }}>
          <Typography variant="bodySmall" color="onPrimary">
            {item.duration}
          </Typography>
        </View>

        {/* Offline Indicator */}
        {item.isAvailableOffline && (
          <View style={{
            position: 'absolute',
            top: 4,
            left: 4,
            backgroundColor: colors.primary,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 4,
          }}>
            <Icon name="download" size={12} color="white" />
          </View>
        )}
      </View>

      {/* Content Info */}
      <View style={{ flex: 1 }}>
        <Typography variant="titleMedium" color="onSurface" numberOfLines={2}>
          {item.title}
        </Typography>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
          <Icon name={getContentTypeIcon(item.contentType)} size={14} color={colors.onSurfaceVariant} />
          <Typography variant="bodySmall" color="onSurfaceVariant">
            {getContentTypeLabel(item.contentType)}
          </Typography>

          {item.episodeInfo && (
            <>
              <View style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: colors.onSurfaceVariant,
              }} />
              <Typography variant="bodySmall" color="onSurfaceVariant">
                {item.episodeInfo}
              </Typography>
            </>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            {item.progress}% complete
          </Typography>
          <View style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: colors.onSurfaceVariant,
          }} />
          <Typography variant="bodySmall" color="onSurfaceVariant">
            {item.timeRemaining} remaining
          </Typography>
        </View>

        <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginTop: 2 }}>
          Last watched {item.lastWatched}
        </Typography>
      </View>

      {/* Resume Button */}
      <TouchableOpacity
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 12,
        }}
        onPress={() => handleResumePress(item)}
      >
        <Icon name="play_arrow" size={24} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const EmptyState: React.FC = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 64,
    }}>
      <Icon name="play_circle" size={64} color={colors.onSurfaceVariant} />
      <Typography variant="headlineSmall" color="onSurface" style={{ marginTop: 16, textAlign: 'center' }}>
        Nothing to Continue
      </Typography>
      <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}>
        Start watching some content and it will appear here for easy resuming
      </Typography>
      <SecondaryButton
        onPress={() => console.log('Browse content')}
        style={{ marginTop: 24 }}
      >
        Browse Content
      </SecondaryButton>
    </View>
  );

  const QuickActions: React.FC = () => {
    const actions: QuickAction[] = [
      { id: 'clear_completed', label: 'Clear Completed', icon: 'check_circle', action: () => console.log('Clear completed') },
      { id: 'sort_recent', label: 'Sort by Recent', icon: 'schedule', action: () => setSortBy('recent') },
      { id: 'sort_progress', label: 'Sort by Progress', icon: 'trending_up', action: () => setSortBy('progress') },
      { id: 'sort_type', label: 'Sort by Type', icon: 'sort', action: () => setSortBy('type') },
    ];

    return (
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 12 }}>
          Quick Actions
        </Typography>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {actions.map((action) => (
            <TextButton
              key={action.id}
              onPress={action.action}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Icon name={action.icon as any} size={16} color={colors.primary} />
              <Typography variant="labelLarge" color="primary">
                {action.label}
              </Typography>
            </TextButton>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title="Continue Watching"
        leadingIcon="arrow_back"
        trailingIcons={['search', 'more_vert']}
        onLeadingIconPress={() => console.log('Back pressed')}
        onTrailingIconPress={(icon) => console.log(`${icon} pressed`)}
        elevated={true}
      />

      {continueWatchingItems.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={sortItems(continueWatchingItems)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ContinueWatchingCard item={item} />}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListHeaderComponent={<QuickActions />}
        />
      )}
    </View>
  );
};