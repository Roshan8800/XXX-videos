import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { AppBar, ClickableCard } from '../../shared/components';
import { SecondaryButton, TextButton } from '../../shared/components/button';
import { Icon } from '../../shared/utils/icons';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';

interface VideoRecommendation {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadedAt: string;
  studio: string;
  category: string;
  matchScore: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface RecommendationSection {
  id: string;
  title: string;
  subtitle: string;
  videos: VideoRecommendation[];
  icon: string;
}

export const RecommendationsScreen: React.FC = () => {
  const { colors } = useTheme();

  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [refreshing, setRefreshing] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState<RecommendationSection[]>([]);
  const [continueWatching, setContinueWatching] = React.useState<any[]>([]);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  const categories = [
    { id: 'all', label: 'For You', icon: 'person' },
    { id: 'trending', label: 'Trending', icon: 'trending_up' },
    { id: 'new', label: 'New Releases', icon: 'new_releases' },
    { id: 'premium', label: 'Premium', icon: 'star' },
    { id: 'amateur', label: 'Amateur', icon: 'videocam' },
  ];

  const recommendationSections: RecommendationSection[] = [
    {
      id: 'personalized',
      title: 'Recommended for You',
      subtitle: 'Based on your viewing history and preferences',
      icon: 'recommend',
      videos: [
        {
          id: '1',
          title: 'Passionate Encounter',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG3kuGah_A3v8zGxOH_n5RHxLNF9wuW-nSGDHSfWuOS8rs3Zb9DaE4FY-SHjbpmasr701QvdGy0qVz7x0H4O7NqW8Y4xYMCcfNjQJDUMScko9yokL43xDV7VGpeyL5ck5R72ZRMaAXDercigEG60CDZCAsXh6LiJE9_TVXDvyo-0m0FrjDCtbKZhi5tEVIC9x0eLpBdiCwrc2wNfwOJeuB7aJEEQThwTEKm3LUdApwVY4--J1HT4JvhObA4cVddDrFrNuP_y-oVlw',
          duration: '12:34',
          views: '1.2M',
          uploadedAt: '2 days ago',
          studio: 'StudioX',
          category: 'Professional',
          matchScore: 95,
        },
        {
          id: '2',
          title: 'Forbidden Desires',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0xOvkjHRorucKMVMrhS_rzzkb1B0T64f2HgjEazVYlPZvNaf6hl2vTjThwEqCtzrI1SH7AXnsi2DvfuhslvBhfEn_hkEPUdtiDSONjJ4QwQBmwzhUzLl4AP9la-xSpvkA8FrLnKiCc60Z0xNyB-bexnMqGuU2wnx1u7MLe4K40T8LjM52iyXrI-X62WMwy3cVi6qqJDwoVgSmAhk95c5JrnFdqfo_qmLsq-BAoyyyd3amKAqoATkqb1i1YQom5mJbsMEU11gJKRY',
          duration: '08:52',
          views: '890K',
          uploadedAt: '1 week ago',
          studio: 'Siren Productions',
          category: 'Fetish',
          matchScore: 87,
        },
        {
          id: '3',
          title: 'Secret Rendezvous',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-rVtg-4C9jfvrmsAv6qoZRpgzd_fNVYL_0uAl3EN7lM1GRSgh4akTkvSbNM9aL649XGNRJyrQmer-rzMvy8uo9_L8OtZ8POP75DYUm1OjVxyWzRLbJGJbskRY0zOJJb--Gqz9vThBhBdhGuUrI3gpZHkWaEzaIQCfzqgot1k3_rnNxD9Sr6ydt4q79x5Zo77-zqoWralkA24EVvZucmbv7NwwEZI1eJNhoI1TDYWNxNDSs3qEyuwBNnNlVRFxtqWg3lNhaweofNg',
          duration: '15:10',
          views: '2.5M',
          uploadedAt: '3 weeks ago',
          studio: 'Velvet Dreams',
          category: 'Romance',
          matchScore: 92,
        },
        {
          id: '4',
          title: 'Intimate Moments',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPahh15vMeCtREUyoZIIFA6ox7bh7pVOyRtshPSnPkwxABp1S3S1snCGMgZaB9Eo01bbWPC43FV6SRFyxc1qRFh3nCc2EgYjuN0YaPk1H0J1oQ9XR9nfwzSBPZt0nYnO8Y8wIo4JFSpkeQLInieUn9UoKjH4J4mF66ykK6mfSN9g0WAbNEXx2SJt4iWFk-i_CeEz0cCVe3acjIK5LNTpHSgAynkrCbZHw8RO_ER-JJlQODL7cLE9eD7n1mCloksqhVOBMhYKrOGxw',
          duration: '21:05',
          views: '980K',
          uploadedAt: '1 month ago',
          studio: 'PassionFlix',
          category: 'Amateur',
          matchScore: 78,
        },
      ],
    },
    {
      id: 'trending',
      title: 'Trending Now',
      subtitle: 'Most popular content this week',
      icon: 'trending_up',
      videos: [
        {
          id: '5',
          title: 'Hidden Fantasies',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOta7-915iHTQIwlQTtimgzw6XW-A73WD2vt86Tbqi37TwhS3G7qqvgdG6niWltaJaw6BV2GRJiFrYTZQaDzS8b2SwxQIYQ6-jQ8M7rNIoWz2rxkWU5A6LSNxFMizmUOwOpv5lwtvj8Ye2Wqfz8sdiOlCXRnuau53BSUqNkzmjM5lgrowZotp70qr3tRFPzim1RZBWxCsd8GPrQA7IhIr0HMbuoGA6PVWlACVYMlmenleXnQaYRs8QCYwWzSsVFRLkGiKJ8cmgq4I',
          duration: '11:22',
          views: '4.1M',
          uploadedAt: '5 days ago',
          studio: 'Ecstasy Films',
          category: 'BDSM',
          matchScore: 0,
        },
        {
          id: '6',
          title: 'Private Affair',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfawBrLBau5YpTUr0I0XqrG1Fi50EWDkERFuoYkZTnIsVZZbuwthcgfUWZY6_WsKBzlEFVMBDDA-l7irz2WqkD_hyTPRIYpa21VS5IoxO5i9zne5HH6HOPUSsA7iyihueGyubwpYTsgQNU7_fMUsW6TuQK2Vl5dfIkFHm5kmbM9rWEnaJfn5lz2g7UJ0CvMFTRFQWzAwvjdV1pH04--OflVsRCVIFkQydB1NVlbVbsc49fWAzDlkafteVmmUkD2XnwvuePQiAQaFU',
          duration: '18:30',
          views: '750K',
          uploadedAt: '2 weeks ago',
          studio: 'StudioX',
          category: 'Roleplay',
          matchScore: 0,
        },
      ],
    },
    {
      id: 'new-releases',
      title: 'New Releases',
      subtitle: 'Fresh content added this week',
      icon: 'new_releases',
      videos: [
        {
          id: '7',
          title: 'Steamy Secrets',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-Gk4l840f3mo-J1QdHZGWZTUiOfpaKmQFOEMjEB8d-LN6iquO8R4dP98EgRQ_8g_e7PvkbNL-fTkM3T8xitQ4OCDAKb7oeWcfWgkZv9UV2ckkx9xALI4p0WlpsfySW_PWUtFwRTiZxFIZBhwhtasmVtZyhfBtlaG9L2120G4SBjM5B2TqSNaFMhNaH3V3OfDtz_L9RDK4h2-Sqk9IrDkwRk2F3dG5LwCrol_3l6W0QZGSSfEd3uOtFn2VUpchSZq2XP7jlAn63K4',
          duration: '14:01',
          views: '3.2M',
          uploadedAt: '1 day ago',
          studio: 'Siren Productions',
          category: 'Lesbian',
          matchScore: 0,
        },
        {
          id: '8',
          title: 'Sensual Whispers',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKmiQERZVn1-oo5J3TLe0lejr_aDiZwIDkja9GwZKc7OIqgWeiJb-tSE-alCZOOWxVcgb1WIr4CKEGot1Cpr5YAWF_e2jxdBnFezEclhNh3b2xrN4v8C1H3l_nsE2MLmq4RZAOItRF0VefjjiYJGW7w9rTYDfLf1pv70czQnKLtbWBtG6JcFMb2XhS3rs0lDQ8wCyYZ1ekd9J7L8QJN9DNFowICh8_sQ_10bMzZpjlhbNdJWjZdHZZUDa7F6t8XaHu3S-HeVz03E4',
          duration: '09:45',
          views: '1.8M',
          uploadedAt: '6 days ago',
          studio: 'Velvet Dreams',
          category: 'Gay',
          matchScore: 0,
        },
      ],
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleVideoPress = (video: VideoRecommendation) => {
    console.log('Play video:', video.title);
  };

  const handleLikePress = (videoId: string) => {
    console.log('Toggle like for video:', videoId);
  };

  const handleBookmarkPress = (videoId: string) => {
    console.log('Toggle bookmark for video:', videoId);
  };

  const loadRecommendations = async () => {
    try {
      const user = AuthUtils.getCurrentUser();
      if (!user) return;

      setCurrentUser(user);

      // Get user profile for preferences
      const userProfile = await FirestoreUtils.getDocument('users', user.uid) as any;

      // Load personalized recommendations
      const personalizedQuery = await FirestoreUtils.queryDocuments('videos', [
        FirestoreUtils.where('category', 'in', userProfile?.preferences?.favoriteCategories || ['Professional', 'Romance']),
        FirestoreUtils.where('isActive', '==', true)
      ]);

      // Load trending videos
      const trendingQuery = await FirestoreUtils.queryDocuments('videos', [
        FirestoreUtils.where('isActive', '==', true)
      ]).then(videos => videos.sort((a, b) => parseInt(b.views) - parseInt(a.views)).slice(0, 6));

      // Load new releases
      const newReleasesQuery = await FirestoreUtils.queryDocuments('videos', [
        FirestoreUtils.where('isActive', '==', true)
      ]).then(videos => videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6));

      // Load continue watching
      const continueWatchingVideos = userProfile?.videoHistory?.filter((item: any) => item.progress > 0 && item.progress < 100) || [];

      const recommendationSections: RecommendationSection[] = [
        {
          id: 'personalized',
          title: 'Recommended for You',
          subtitle: 'Based on your viewing history and preferences',
          icon: 'recommend',
          videos: personalizedQuery.slice(0, 4)
        },
        {
          id: 'trending',
          title: 'Trending Now',
          subtitle: 'Most popular content this week',
          icon: 'trending_up',
          videos: trendingQuery
        },
        {
          id: 'new-releases',
          title: 'New Releases',
          subtitle: 'Fresh content added this week',
          icon: 'new_releases',
          videos: newReleasesQuery
        }
      ];

      setRecommendations(recommendationSections);
      setContinueWatching(continueWatchingVideos);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  React.useEffect(() => {
    loadRecommendations();
  }, []);

  const VideoCard: React.FC<{ video: VideoRecommendation; showMatchScore?: boolean }> = ({
    video,
    showMatchScore = false
  }) => (
    <ClickableCard
      style={{
        width: '100%',
        marginBottom: 16,
      }}
      onPress={() => handleVideoPress(video)}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: video.thumbnail }}
          style={{
            width: '100%',
            height: 200,
            borderRadius: 12,
          }}
          resizeMode="cover"
        />

        {/* Duration Badge */}
        <View style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 4,
        }}>
          <Typography variant="labelSmall" color="onPrimary">
            {video.duration}
          </Typography>
        </View>

        {/* Match Score Badge */}
        {showMatchScore && video.matchScore > 0 && (
          <View style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: colors.primary,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
            <Typography variant="labelSmall" color="onPrimary">
              {video.matchScore}% match
            </Typography>
          </View>
        )}

        {/* Action Buttons */}
        <View style={{
          position: 'absolute',
          top: 8,
          right: 8,
          gap: 8,
        }}>
          <TouchableOpacity
            onPress={() => handleBookmarkPress(video.id)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon
              name={video.isBookmarked ? "bookmark" : "bookmark_border"}
              size={16}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 12, gap: 4 }}>
        <Typography variant="titleMedium" color="onSurface" numberOfLines={2}>
          {video.title}
        </Typography>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            {video.studio}
          </Typography>
          <View style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.onSurfaceVariant,
          }} />
          <Typography variant="bodySmall" color="onSurfaceVariant">
            {video.category}
          </Typography>
        </View>

        <Typography variant="bodySmall" color="onSurfaceVariant">
          {video.views} views • {video.uploadedAt}
        </Typography>
      </View>
    </ClickableCard>
  );

  const renderCategoryTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 16 }}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => setSelectedCategory(category.id)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: selectedCategory === category.id ? colors.primary : colors.surfaceVariant,
          }}
        >
          <Icon
            name={category.icon as any}
            size={18}
            color={selectedCategory === category.id ? colors.onPrimary : colors.onSurfaceVariant}
          />
          <Typography
            variant="labelLarge"
            color={selectedCategory === category.id ? 'onPrimary' : 'onSurfaceVariant'}
          >
            {category.label}
          </Typography>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderRecommendationSection = (section: RecommendationSection) => (
    <View key={section.id} style={{ marginBottom: 32 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, paddingHorizontal: 16 }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.primary + '20',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Icon name={section.icon as any} size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Typography variant="titleLarge" color="onSurface">
            {section.title}
          </Typography>
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            {section.subtitle}
          </Typography>
        </View>
        <TextButton onPress={() => console.log('View all for', section.title)}>
          <Typography variant="labelLarge" color="primary">
            View All
          </Typography>
        </TextButton>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
      >
        {section.videos.map((video) => (
          <View key={video.id} style={{ width: 280 }}>
            <VideoCard
              video={video}
              showMatchScore={section.id === 'personalized'}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title="For You"
        leadingIcon="person"
        trailingIcons={['search', 'notifications']}
        onLeadingIconPress={() => console.log('Profile pressed')}
        onTrailingIconPress={(icon) => console.log(`${icon} pressed`)}
        elevated={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <TouchableOpacity onPress={handleRefresh} disabled={refreshing}>
            <View style={{ alignItems: 'center', padding: 16 }}>
              <Icon
                name={refreshing ? "sync" : "refresh"}
                size={24}
                color={colors.onSurfaceVariant}
              />
              <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginTop: 4 }}>
                {refreshing ? 'Refreshing...' : 'Pull to refresh'}
              </Typography>
            </View>
          </TouchableOpacity>
        }
      >
        {/* Category Tabs */}
        {renderCategoryTabs()}

        {/* Recommendation Sections */}
        {recommendationSections.map(renderRecommendationSection)}

        {/* Continue Watching Section */}
        <View style={{ marginBottom: 32, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.primary + '20',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Icon name="play_circle" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Typography variant="titleLarge" color="onSurface">
                Continue Watching
              </Typography>
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                Pick up where you left off
              </Typography>
            </View>
          </View>

          <ClickableCard
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              padding: 16,
            }}
            onPress={() => console.log('Continue watching')}
          >
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG3kuGah_A3v8zGxOH_n5RHxLNF9wuW-nSGDHSfWuOS8rs3Zb9DaE4FY-SHjbpmasr701QvdGy0qVz7x0H4O7NqW8Y4xYMCcfNjQJDUMScko9yokL43xDV7VGpeyL5ck5R72ZRMaAXDercigEG60CDZCAsXh6LiJE9_TVXDvyo-0m0FrjDCtbKZhi5tEVIC9x0eLpBdiCwrc2wNfwOJeuB7aJEEQThwTEKm3LUdApwVY4--J1HT4JvhObA4cVddDrFrNuP_y-oVlw' }}
              style={{
                width: 80,
                height: 60,
                borderRadius: 8,
              }}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Typography variant="titleMedium" color="onSurface">
                Passionate Encounter
              </Typography>
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                StudioX • 8:32 remaining
              </Typography>
            </View>
            <Icon name="play_circle" size={32} color={colors.primary} />
          </ClickableCard>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 8 }}>
            Quick Access
          </Typography>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <SecondaryButton
              onPress={() => console.log('Browse categories')}
              style={{ flex: 1 }}
            >
              Browse Categories
            </SecondaryButton>
            <SecondaryButton
              onPress={() => console.log('View watchlist')}
              style={{ flex: 1 }}
            >
              My Watchlist
            </SecondaryButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
