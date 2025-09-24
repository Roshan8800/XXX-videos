import React from 'react';
import { ScrollView, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ClickableCard, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton } from '../../shared/components/button';
import { AuthUtils, FirestoreUtils } from '../../shared/utils/firebase-utils';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
}

interface RelatedVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
}

export const VideoPlaybackScreen: React.FC = () => {
  const { colors } = useTheme();

  const videoData = {
    title: 'Intimate Encounters',
    uploader: 'Isabella Rossi',
    uploadDate: '2 weeks ago',
    views: '1.2M',
    description: 'Experience the most intimate moments captured in stunning detail. This exclusive content showcases the beauty of human connection in its most raw and authentic form.',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEqxGmn3BkRXmD9up77IOnX7BqsowQSIIyqjAg7CzgM2z0susOLjqKDAvF17O0dJZwOghdS8agkkWfsPncna6yqSCxJY27XFMoPFBR33G9fm2BU_Zdup8ZqfOOnGL3v-McdP3UJedzwKWe_8lB9HVUFX-nyr--wL_gxozeQyPuuCjIGRCFaDpAh3zc5ito63Qu5tRWWxlYE87c7cfM_NfbGN6kvI6c_SxKd5ebEXqFCnKthx2U8L3dmWZzhG2qIm73gPxIJ-JWztw',
    isPremium: true,
  };

  const comments: Comment[] = [
    {
      id: '1',
      user: {
        name: 'Liam Carter',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBngYkj3O5jZARS-wBbT_4sk5fpReFqtIx7VpwUdXvU839rX60Y620SZ0IyogtYlj2DXdg3lpk931H72tpBvb8H7rm1S5zyZKSk7yBad0nRVojsgobuMocwdSVg4LwQ2bMeIwkqTv9JUt07ULWsIwoxVWU42nkceWivaqh682FcUT3AeVXH9NEii_-7Nlr8eD1X4lX0HRUyFp-pc-hLOOys-mJdtQ6nnCH-ksqj91n_3W-p33ZduiDVVSlRtneL1qeyUT0eMSsOXBU',
      },
      timestamp: '2 days ago',
      content: 'Absolutely stunning performance! The chemistry between the actors is palpable.',
    },
    {
      id: '2',
      user: {
        name: 'Sophia Bennett',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_xzzHYMRkfjNrs98LXFJX8cijduNjd4TI3J44tuaa1d1ckqhMxYHMz_k4x8WbtJuJohOalGTsTHJ9gU4Dr9oRLSSto1dz6oQE8LD4fAYqfllqdEXqXQo55oxSyZadLSEarb2ofnuh6FXsQt4BpMDJnECEF-6YyoHszFji0bvq_vA60TiXtehVaC5p0HF9nIfHT-1yaZzwuyg1ulo4emxL-XKcLZkEgrufUOvvxs7iHhn3VpTiX_jBm2BdMvAwBDklly4EKjZBZSg',
      },
      timestamp: '1 day ago',
      content: 'This scene is incredibly sensual and beautifully shot. A true work of art.',
    },
    {
      id: '3',
      user: {
        name: 'Ethan Walker',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGUsPSMiI50X_e1lwnvf9lSzp_m0Lu637tglW7UeM0PU5faxHF5T15lAq7OsSr2TK5AhKR3RW0wwDpbqjXWDsIfnQLd4on-X7vTJeymsxRw7ROlyZQDVimiwAUiwuUqV3qa4FPnL_htoQKG3sgUPqhwTeBNxulbyMrnHPUtuC72DjBN8ZYQOgrkBE3GKuFNh04NprKACPW_H_nFi_sKvX9YYe0vbaHGC1LwKbZFvWhBkFLSZ2keS5rBA8LxUt2LM-tBY6U1w4XWm0',
      },
      timestamp: '12 hours ago',
      content: 'The attention to detail in this video is remarkable. The lighting, the music, everything enhances the experience.',
    },
  ];

  const relatedVideos: RelatedVideo[] = [
    {
      id: '1',
      title: 'Private Moments',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsGO9o5zny5mH50xBPI1587UxKWOz_yin4Cq8-JBwbtzp796uIPpj_Ho3AhiDhJmB_kZLex2giN4yWDskURb4hv8xYaZconFqtT24SR740063rqgCP-K4Q_KnIZ3NiAh979b389HUXRmwrWGJnzmVGzyPORWQLB7udMl3-r1CaQXc0tepefxgnMHsbCZFOBgy1uLbbDbn492EmMQNba-oC_qV3M4EbjMBLz1f54rDacstTfq4XgJwMZc5owitkTMBJkHeC7iTVM1E',
      views: '100K',
      duration: '15:30',
    },
    {
      id: '2',
      title: 'Forbidden Desires',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxfNmazeYaxFpng20trS5S_mUzus7k3ZXpHlAunyW3jcxmmuEBMYiblIWEZK8K9YP4qzTirHW2mjHAHhg5VnHEm6PvarLFOz2FYAWlaHpYfYfcAlA3vpmPOEo61RBXAw9YkDH4PivErmbJasM4u9T-1QloS4Q4Y4sPx0Bb3LD-3AAlRH6q4W1ouiPRv3_Dui3oIIHMHDEd48PHMW0KP6IAC4SxAgwF6C_hemeGsRRRZEHaqR8egLL-dK7yUKRvNk1QZukIczcSeNg',
      views: '150K',
      duration: '22:45',
    },
    {
      id: '3',
      title: 'Secret Rendezvous',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlfhNuwCq2nsCTmAcBD0OD5ncgkKcZ0HNlfRBhg2dr1daWfjo1CziQ9OJ2hLWl9KXWsLCvvVm-JDQtq_NutnPTlmhgYHVXgj5QW4t2yDAxoMHBn8EX3S7gE9z3k6kseNzxRpNQDEFd5qfSESxlVq28hjZSBh5tnJTSu1PQi5PmwEBmr5CirM-ZXu-4GlUxvCFhEDg8el16s_BY9ZH83BdXOZIWGJ0Q-osWhsl35LjrOjdPPrg6B4qPTh62Gf4F_RWc9QkrdER3YE8',
      views: '80K',
      duration: '18:20',
    },
    {
      id: '4',
      title: 'Hidden Passions',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJbNQO08FAMr6PlkjqMaFhuVx60_HPtypdh0-6W1K-J5tUKXiQ6o5ddbkgqTZUp_BBGqD8PYP9SMkVTmfxlxD-qXLSqtvntvyEYDmTT3RRchXAFs8c3Rco9KF75BUWWpj_1aig5vvrXbfqFQ_ybi42eFsmEoQKrbcqUPXzBfwIUG8IAyaHl1ZG_5qbPVpfMj-bfeq8mwIHzxoTq-7cyIsjV1hSee3_n1Gtxm6ktsG6DDQK6DdwfONakuWSenzvI_PEO_sdwueUF4Y',
      views: '120K',
      duration: '25:15',
    },
  ];

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [videoId] = React.useState('video123'); // This should come from props/navigation

  const loadUserPreferences = async () => {
    try {
      const user = AuthUtils.getCurrentUser();
      if (!user) {
        console.log('No authenticated user');
        return;
      }

      setCurrentUser(user);

      // Load user preferences for video playback
      const userProfile = await FirestoreUtils.getDocument('users', user.uid) as any;

      if (userProfile) {
        // Load user's like/bookmark status for this video
        const videoHistory = userProfile.videoHistory || {};
        const videoData = videoHistory[videoId];

        if (videoData) {
          setIsLiked(videoData.isLiked || false);
          setIsSaved(videoData.isBookmarked || false);
        }
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const trackVideoProgress = async (progress: number) => {
    try {
      const user = AuthUtils.getCurrentUser();
      if (!user) {
        return;
      }

      // Update video progress in Firestore
      const userProfile = await FirestoreUtils.getDocument('users', user.uid) as any;
      const videoHistory = userProfile.videoHistory || {};

      await FirestoreUtils.updateDocument('users', user.uid, {
        videoHistory: {
          ...videoHistory,
          [videoId]: {
            ...videoHistory[videoId],
            progress: progress,
            lastWatched: new Date(),
            title: videoData.title,
            thumbnail: videoData.thumbnail,
          }
        }
      });

      console.log('Video progress tracked:', progress);
    } catch (error) {
      console.error('Error tracking video progress:', error);
    }
  };

  const handleLikeToggle = async () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    try {
      const user = AuthUtils.getCurrentUser();
      if (!user) {
        return;
      }

      // Update like status in Firestore
      const userProfile = await FirestoreUtils.getDocument('users', user.uid) as any;
      const videoHistory = userProfile.videoHistory || {};

      await FirestoreUtils.updateDocument('users', user.uid, {
        videoHistory: {
          ...videoHistory,
          [videoId]: {
            ...videoHistory[videoId],
            isLiked: newIsLiked,
            lastWatched: new Date(),
            title: videoData.title,
            thumbnail: videoData.thumbnail,
          }
        }
      });

      console.log('Like toggled for video:', videoId);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert the change if save failed
      setIsLiked(isLiked);
    }
  };

  const handleSaveToggle = async () => {
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);

    try {
      const user = AuthUtils.getCurrentUser();
      if (!user) {
        return;
      }

      // Update bookmark status in Firestore
      const userProfile = await FirestoreUtils.getDocument('users', user.uid) as any;
      const videoHistory = userProfile.videoHistory || {};

      await FirestoreUtils.updateDocument('users', user.uid, {
        videoHistory: {
          ...videoHistory,
          [videoId]: {
            ...videoHistory[videoId],
            isBookmarked: newIsSaved,
            lastWatched: new Date(),
            title: videoData.title,
            thumbnail: videoData.thumbnail,
          }
        }
      });

      console.log('Bookmark toggled for video:', videoId);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Revert the change if save failed
      setIsSaved(isSaved);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      return;
    }

    try {
      const user = AuthUtils.getCurrentUser();
      if (!user) {
        return;
      }

      // Add comment to Firestore
      const commentData = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userAvatar: user.photoURL || '',
        content: commentText,
        timestamp: new Date(),
        videoId: videoId,
      };

      // Add to video comments collection
      await FirestoreUtils.addDocument(`videos/${videoId}/comments`, commentData);

      // Clear comment text
      setCommentText('');

      console.log('Comment added:', commentData);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Load user preferences on component mount
  React.useEffect(() => {
    loadUserPreferences();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* App Bar */}
      <AppBar
        title="PlayNite"
        leadingIcon="arrow_back"
        trailingIcons={['search', 'notifications']}
        onLeadingIconPress={() => console.log('Back pressed')}
        onTrailingIconPress={(icon) => console.log(`${icon} pressed`)}
        elevated={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Video Player */}
        <View style={{ marginBottom: 16 }}>
          <View style={{
            aspectRatio: 16 / 9,
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            <Image
              source={{ uri: videoData.thumbnail }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
            />
            <View style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <TouchableOpacity
                onPress={async () => {
                  const newIsPlaying = !isPlaying;
                  setIsPlaying(newIsPlaying);

                  // Track video play/pause
                  if (newIsPlaying) {
                    await trackVideoProgress(0); // Started playing
                  } else {
                    await trackVideoProgress(50); // Paused at 50% (example)
                  }
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name={isPlaying ? 'pause' : 'play_arrow'}
                  size={40}
                  color={colors.onPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Video Info */}
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <Typography variant="headlineMedium" color="onBackground">
              {videoData.title}
            </Typography>
            <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginTop: 4 }}>
              {videoData.uploader} · {videoData.uploadDate} · {videoData.views} views
            </Typography>
          </View>

          {/* Engagement Buttons */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginTop: 16,
            gap: 8,
          }}>
            <TouchableOpacity
              onPress={handleLikeToggle}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.surfaceVariant,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                gap: 8,
              }}
            >
              <Icon
                name={isLiked ? 'favorite' : 'favorite_border'}
                size={20}
                color={isLiked ? colors.primary : colors.onSurfaceVariant}
              />
              <Typography variant="labelLarge" color={isLiked ? 'primary' : 'onSurfaceVariant'}>
                15K
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.surfaceVariant,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                gap: 8,
              }}
            >
              <Icon name="thumb_down" size={20} color={colors.onSurfaceVariant} />
              <Typography variant="labelLarge" color="onSurfaceVariant">
                2K
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.surfaceVariant,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                gap: 8,
              }}
            >
              <Icon name="share" size={20} color={colors.onSurfaceVariant} />
              <Typography variant="labelLarge" color="onSurfaceVariant">
                5K
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSaveToggle}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.surfaceVariant,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                gap: 8,
              }}
            >
              <Icon
                name={isSaved ? 'bookmark' : 'bookmark_border'}
                size={20}
                color={isSaved ? colors.primary : colors.onSurfaceVariant}
              />
              <Typography variant="labelLarge" color={isSaved ? 'primary' : 'onSurfaceVariant'}>
                1K
              </Typography>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            {videoData.isPremium && (
              <PrimaryButton
                onPress={() => console.log('Purchase Premium pressed')}
                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
              >
                Purchase Premium
              </PrimaryButton>
            )}
          </View>

          {/* Description */}
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <Typography variant="bodyLarge" color="onSurface">
              {videoData.description}
            </Typography>
          </View>
        </View>

        {/* Comments Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Typography variant="titleLarge" color="onBackground" style={{ marginBottom: 16 }}>
            Comments (234)
          </Typography>

          {/* Add Comment */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surfaceVariant,
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 16,
            gap: 12,
          }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Icon name="person" size={16} color={colors.onPrimary} />
            </View>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a comment..."
              placeholderTextColor={colors.onSurfaceVariant}
              style={{
                flex: 1,
                color: colors.onSurface,
                fontSize: 14,
              }}
            />
            <TouchableOpacity
              onPress={handleAddComment}
              disabled={!commentText.trim()}
              style={{
                opacity: commentText.trim() ? 1 : 0.5,
              }}
            >
              <Icon
                name="arrow_forward"
                size={20}
                color={commentText.trim() ? colors.primary : colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {comments.map((comment) => (
            <View key={comment.id} style={{
              flexDirection: 'row',
              marginBottom: 20,
              gap: 12,
            }}>
              <Image
                source={{ uri: comment.user.avatar }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
              />
              <View style={{ flex: 1 }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                  gap: 8,
                }}>
                  <Typography variant="labelLarge" color="onSurface">
                    {comment.user.name}
                  </Typography>
                  <Typography variant="labelSmall" color="onSurfaceVariant">
                    {comment.timestamp}
                  </Typography>
                </View>
                <Typography variant="bodyMedium" color="onSurface">
                  {comment.content}
                </Typography>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Related Videos Sidebar */}
      <View style={{
        position: 'absolute',
        right: 0,
        top: 64,
        bottom: 0,
        width: 320,
        backgroundColor: colors.background,
        borderLeftWidth: 1,
        borderLeftColor: colors.outlineVariant,
        padding: 16,
      }}>
        <Typography variant="titleLarge" color="onBackground" style={{ marginBottom: 16 }}>
          Related Videos
        </Typography>

        <ScrollView showsVerticalScrollIndicator={false}>
          {relatedVideos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={{
                flexDirection: 'row',
                marginBottom: 16,
                gap: 12,
              }}
              onPress={() => console.log('Play related video:', video.id)}
            >
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: video.thumbnail }}
                  style={{
                    width: 120,
                    height: 68,
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
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
                    {video.duration}
                  </Typography>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Typography
                  variant="bodyMedium"
                  color="onSurface"
                  numberOfLines={2}
                  style={{ marginBottom: 4 }}
                >
                  {video.title}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  {video.views} views
                </Typography>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};