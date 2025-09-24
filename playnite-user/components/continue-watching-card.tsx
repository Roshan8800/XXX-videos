import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';

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

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
  onPress?: (item: ContinueWatchingItem) => void;
  onResumePress?: (item: ContinueWatchingItem) => void;
  onQuickAction?: (action: string, item: ContinueWatchingItem) => void;
  showQuickActions?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ContinueWatchingCard: React.FC<ContinueWatchingCardProps> = ({
  item,
  onPress,
  onResumePress,
  onQuickAction,
  showQuickActions = false,
  size = 'medium',
}) => {
  const { colors } = useTheme();

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

  const getCardDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 280, height: 160 };
      case 'large':
        return { width: 360, height: 200 };
      default:
        return { width: 320, height: 180 };
    }
  };

  const dimensions = getCardDimensions();

  const handleCardPress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  const handleResumePress = () => {
    if (onResumePress) {
      onResumePress(item);
    }
  };

  const handleQuickActionPress = (action: string) => {
    if (onQuickAction) {
      onQuickAction(action, item);
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        overflow: 'hidden',
      }}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      <View style={{ position: 'relative' }}>
        {/* Thumbnail */}
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            width: '100%',
            height: dimensions.height,
          }}
          resizeMode="cover"
        />

        {/* Progress Bar Overlay */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
          <View style={{
            height: '100%',
            width: `${item.progress}%`,
            backgroundColor: colors.primary,
          }} />
        </View>

        {/* Duration Badge */}
        <View style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          paddingHorizontal: 6,
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
            top: 8,
            left: 8,
            backgroundColor: colors.primary,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}>
            <Icon name="download" size={12} color="white" />
          </View>
        )}

        {/* Mature Content Indicator */}
        {item.isMature && (
          <View style={{
            position: 'absolute',
            top: 8,
            left: item.isAvailableOffline ? 40 : 8,
            backgroundColor: colors.error,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}>
            <Typography variant="bodySmall" color="onError">
              18+
            </Typography>
          </View>
        )}

        {/* Progress Badge */}
        <View style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 6,
        }}>
          <Typography variant="bodySmall" color="onPrimary">
            {item.progress}% complete
          </Typography>
        </View>

        {/* Resume Button Overlay */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleResumePress}
        >
          <Icon name="play_arrow" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content Info */}
      <View style={{ padding: 16 }}>
        <Typography variant="titleMedium" color="onSurface" numberOfLines={2}>
          {item.title}
        </Typography>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
          <Icon name={getContentTypeIcon(item.contentType)} size={16} color={colors.onSurfaceVariant} />
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

          {item.seasonInfo && (
            <>
              <View style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: colors.onSurfaceVariant,
              }} />
              <Typography variant="bodySmall" color="onSurfaceVariant">
                {item.seasonInfo}
              </Typography>
            </>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            {item.timeRemaining} remaining
          </Typography>
          <View style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: colors.onSurfaceVariant,
          }} />
          <Typography variant="bodySmall" color="onSurfaceVariant">
            Last watched {item.lastWatched}
          </Typography>
        </View>

        {/* Quick Actions */}
        {showQuickActions && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
            gap: 8,
          }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 16,
                gap: 4,
              }}
              onPress={() => handleQuickActionPress('favorite')}
            >
              <Icon name="favorite_border" size={16} color={colors.onSurfaceVariant} />
              <Typography variant="bodySmall" color="onSurfaceVariant">
                Add to Favorites
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 16,
                gap: 4,
              }}
              onPress={() => handleQuickActionPress('watchlist')}
            >
              <Icon name="bookmark" size={16} color={colors.onSurfaceVariant} />
              <Typography variant="bodySmall" color="onSurfaceVariant">
                Add to Watchlist
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 16,
                gap: 4,
              }}
              onPress={() => handleQuickActionPress('share')}
            >
              <Icon name="share" size={16} color={colors.onSurfaceVariant} />
              <Typography variant="bodySmall" color="onSurfaceVariant">
                Share
              </Typography>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};