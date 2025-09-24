import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, RefreshControl, Dimensions } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton } from '../../shared/components/button';
import { LiveStreamCard, LiveStreamData, StreamStatusType } from '../components/live-stream-card';
import { StreamSchedule, ScheduledStream } from '../components/stream-schedule';
import { LiveChat, ChatMessage } from '../components/live-chat';

// Mock data for demonstration
const mockLiveStreams: LiveStreamData[] = [
  {
    id: '1',
    title: 'Gaming Night Live: Epic Battles',
    streamer: 'GamerPro2024',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    category: 'Gaming',
    status: 'live',
    viewerCount: 15420,
    duration: '2h 30m',
    description: 'Join us for an epic gaming session with the latest releases!',
    tags: ['Gaming', 'Live', 'Action'],
  },
  {
    id: '2',
    title: 'Cooking with Chef Maria',
    streamer: 'ChefMaria',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    category: 'Cooking',
    status: 'live',
    viewerCount: 8920,
    duration: '1h 45m',
    description: 'Learn to cook delicious Italian dishes from scratch',
    tags: ['Cooking', 'Tutorial', 'Food'],
  },
  {
    id: '3',
    title: 'Tech Talk: Future of AI',
    streamer: 'TechGuru',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    category: 'Technology',
    status: 'upcoming',
    viewerCount: 0,
    startTime: '2024-01-15T18:00:00Z',
    duration: '1h 30m',
    description: 'Discussing the latest developments in artificial intelligence',
    tags: ['Technology', 'AI', 'Discussion'],
  },
  {
    id: '4',
    title: 'Music Production Masterclass',
    streamer: 'BeatMaster',
    thumbnail: 'https://picsum.photos/400/225?random=4',
    category: 'Music',
    status: 'ended',
    viewerCount: 0,
    duration: '3h 15m',
    description: 'Complete guide to music production techniques',
    tags: ['Music', 'Production', 'Tutorial'],
  },
];

const mockScheduledStreams: ScheduledStream[] = [
  {
    id: '5',
    title: 'Morning Yoga Session',
    streamer: 'YogaWithSarah',
    startTime: '2024-01-15T08:00:00Z',
    endTime: '2024-01-15T09:00:00Z',
    duration: '1h',
    category: 'Health',
    status: 'upcoming',
    description: 'Start your day with energizing yoga poses',
  },
  {
    id: '6',
    title: 'Art Workshop: Digital Painting',
    streamer: 'DigitalArtist',
    startTime: '2024-01-15T14:00:00Z',
    endTime: '2024-01-15T16:00:00Z',
    duration: '2h',
    category: 'Art',
    status: 'upcoming',
    description: 'Learn digital painting techniques with professional tools',
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    username: 'Viewer123',
    message: 'This stream is amazing! 🔥',
    timestamp: '2024-01-15T10:30:00Z',
    userColor: '#ff6b6b',
  },
  {
    id: '2',
    username: 'ModeratorMike',
    message: 'Welcome everyone! Remember to follow the rules.',
    timestamp: '2024-01-15T10:31:00Z',
    userColor: '#4ecdc4',
    isModerator: true,
    badges: ['moderator'],
  },
  {
    id: '3',
    username: 'SubscriberFan',
    message: 'Love the content! Keep it up! 💜',
    timestamp: '2024-01-15T10:32:00Z',
    userColor: '#45b7d1',
    isSubscriber: true,
    badges: ['subscriber'],
  },
];

export const LiveStreamsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [liveStreams, setLiveStreams] = useState<LiveStreamData[]>(mockLiveStreams);
  const [scheduledStreams] = useState<ScheduledStream[]>(mockScheduledStreams);
  const [chatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const categories = ['All', 'Gaming', 'Music', 'Technology', 'Cooking', 'Art', 'Health'];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStreams(prevStreams =>
        prevStreams.map(stream => {
          if (stream.status === 'live') {
            // Simulate viewer count changes
            const change = Math.floor(Math.random() * 100) - 50;
            const newCount = Math.max(0, stream.viewerCount + change);
            return { ...stream, viewerCount: newCount };
          }
          return stream;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // In a real app, this would send the message to the chat server
  };

  const handleStreamPress = (stream: LiveStreamData) => {
    console.log('Stream pressed:', stream.title);
    // Navigate to video player or stream details
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredStreams = liveStreams.filter(stream => {
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.streamer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || stream.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const { width } = Dimensions.get('window');
  const isLargeScreen = width > 768;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* App Bar */}
      <AppBar
        title="Live Streams"
        leadingIcon="arrow_back"
        trailingIcons={['search', 'notifications', 'settings']}
        onLeadingIconPress={() => console.log('Back pressed')}
        onTrailingIconPress={(icon) => console.log(`${icon} pressed`)}
        elevated={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search and Filters */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surfaceVariant,
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginRight: 12,
            }}>
              <Icon name="search" size={20} color={colors.onSurfaceVariant} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search streams..."
                placeholderTextColor={colors.onSurfaceVariant}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  color: colors.onSurface,
                  fontSize: 16,
                }}
              />
            </View>
            <SecondaryButton
              onPress={() => setShowChat(!showChat)}
              style={{ minWidth: 48, paddingHorizontal: 12 }}
            >
              <Icon name="chat" size={20} color={colors.primary} />
            </SecondaryButton>
          </View>

          {/* Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {categories.map((category) => (
              <SecondaryButton
                key={category}
                onPress={() => handleCategoryPress(category)}
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: selectedCategory === category ? colors.primary : 'transparent',
                  borderColor: colors.outline,
                }}
              >
                {category}
              </SecondaryButton>
            ))}
          </ScrollView>
        </View>

        {/* Live Streams Grid */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Typography variant="titleLarge" color="onBackground">
              Live Now
            </Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="check_circle" size={12} color="#ff0000" />
              <Typography variant="bodySmall" color="onSurfaceVariant">
                {filteredStreams.filter(s => s.status === 'live').length} live
              </Typography>
            </View>
          </View>

          {filteredStreams.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            >
              {filteredStreams.map((stream) => (
                <LiveStreamCard
                  key={stream.id}
                  stream={stream}
                  onPress={() => handleStreamPress(stream)}
                />
              ))}
            </ScrollView>
          ) : (
            <ElevatedCard style={{ padding: 32, alignItems: 'center' }}>
              <Icon name="search" size={48} color={colors.onSurfaceVariant} />
              <Typography variant="titleMedium" color="onSurfaceVariant" style={{ marginTop: 16, marginBottom: 8 }}>
                No streams found
              </Typography>
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                Try adjusting your search or filters
              </Typography>
            </ElevatedCard>
          )}
        </View>

        {/* Upcoming Streams Schedule */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <StreamSchedule
            streams={scheduledStreams}
            title="Coming Up Next"
            onStreamPress={(stream) => console.log('Scheduled stream pressed:', stream.title)}
          />
        </View>

        {/* Quick Stats */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Card style={{ padding: 16 }}>
            <Typography variant="titleMedium" color="onSurface" style={{ marginBottom: 16 }}>
              Live Stream Stats
            </Typography>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Typography variant="headlineMedium" color="onSurface" style={{ fontWeight: '600' }}>
                  {liveStreams.filter(s => s.status === 'live').length}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  Live Streams
                </Typography>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Typography variant="headlineMedium" color="onSurface" style={{ fontWeight: '600' }}>
                  {liveStreams.filter(s => s.status === 'live').reduce((sum, s) => sum + s.viewerCount, 0).toLocaleString()}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  Total Viewers
                </Typography>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Typography variant="headlineMedium" color="onSurface" style={{ fontWeight: '600' }}>
                  {scheduledStreams.length}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  Upcoming
                </Typography>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Chat Overlay */}
      {showChat && (
        <View style={{
          position: 'absolute',
          right: 16,
          top: 120,
          bottom: 16,
          width: isLargeScreen ? 320 : 280,
          zIndex: 1000,
        }}>
          <LiveChat
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            compact={false}
          />
        </View>
      )}
    </View>
  );
};