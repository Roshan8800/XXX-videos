import React from 'react';
import { View, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';
import { Card, ElevatedCard } from '../../shared/components';
import { ProgressIndicator, WatchProgress, DownloadProgress } from '../../shared/components/progress-indicator';
import { WatchlistItem, WatchStatus, DownloadStatus } from '../types/watchlist';

interface WatchlistCardProps {
  item: WatchlistItem;
  variant?: 'default' | 'compact' | 'featured';
  showProgress?: boolean;
  showDownloadStatus?: boolean;
  showQuickActions?: boolean;
  onPress?: (item: WatchlistItem) => void;
  onQuickAction?: (action: string, item: WatchlistItem) => void;
  style?: ViewStyle;
}

export const WatchlistCard: React.FC<WatchlistCardProps> = ({
  item,
  variant = 'default',
  showProgress = true,
  showDownloadStatus = true,
  showQuickActions = true,
  onPress,
  onQuickAction,
  style,
}) => {
  const { colors } = useTheme();

  const getStatusColor = (status: WatchStatus) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'in_progress':
        return '#2196F3';
      case 'dropped':
        return '#FF9800';
      default:
        return colors.onSurfaceVariant;
    }
  };

  const getStatusIcon = (status: WatchStatus) => {
    switch (status) {
      case 'completed':
        return 'check_circle';
      case 'in_progress':
        return 'play_circle';
      case 'dropped':
        return 'close';
      default:
        return 'visibility';
    }
  };

  const getDownloadIcon = (status: DownloadStatus) => {
    switch (status) {
      case 'downloaded':
        return 'check_circle';
      case 'downloading':
        return 'download';
      case 'error':
        return 'error';
      default:
        return 'download';
    }
  };

  const handleQuickAction = (action: string) => {
    onQuickAction?.(action, item);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const renderCompactCard = () => (
    <TouchableOpacity
      onPress={() => onPress?.(item)}
      activeOpacity={0.8}
      style={style}
    >
      <Card
        variant="filled"
        style={{
          flexDirection: 'row',
          padding: 12,
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            width: 60,
            height: 40,
            borderRadius: 6,
          }}
          resizeMode="cover"
        />

        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Typography
              variant="bodyLarge"
              color="onSurface"
              style={{ flex: 1 }}
              numberOfLines={1}
            >
              {item.title}
            </Typography>
            {item.isPremium && (
              <Icon name="star" size={16} color={colors.primary} />
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              {item.contentType.replace('_', ' ')}
            </Typography>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              •
            </Typography>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              {formatDuration(item.duration)}
            </Typography>
            {item.rating > 0 && (
              <>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  •
                </Typography>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Icon name="star" size={12} color="#FFC107" />
                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    {item.rating.toFixed(1)}
                  </Typography>
                </View>
              </>
            )}
          </View>

          {showProgress && item.watchProgress > 0 && (
            <WatchProgress
              progress={item.watchProgress}
              size="small"
              showPercentage={false}
              style={{ marginTop: 4 }}
            />
          )}
        </View>

        {showQuickActions && (
          <TouchableOpacity
            onPress={() => handleQuickAction('more')}
            style={{
              padding: 8,
              borderRadius: 16,
              backgroundColor: colors.surfaceVariant,
            }}
          >
            <Icon name="more_vert" size={16} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </Card>
    </TouchableOpacity>
  );

  const renderDefaultCard = () => (
    <TouchableOpacity
      onPress={() => onPress?.(item)}
      activeOpacity={0.8}
      style={style}
    >
      <ElevatedCard
        style={{
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        {/* Thumbnail with overlay */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: item.thumbnail }}
            style={{
              width: '100%',
              height: variant === 'featured' ? 200 : 160,
            }}
            resizeMode="cover"
          />

          {/* Status and badges overlay */}
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              right: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {item.isNew && (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <Typography variant="labelSmall" color="onPrimary">
                    New
                  </Typography>
                </View>
              )}
              {item.isPremium && (
                <View
                  style={{
                    backgroundColor: colors.error,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <Typography variant="labelSmall" color="onError">
                    Premium
                  </Typography>
                </View>
              )}
            </View>

            <View style={{ flexDirection: 'row', gap: 4 }}>
              <View
                style={{
                  backgroundColor: getStatusColor(item.watchStatus),
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Icon
                  name={getStatusIcon(item.watchStatus)}
                  size={12}
                  color={colors.onPrimary}
                />
                <Typography variant="labelSmall" color="onPrimary">
                  {item.watchStatus.replace('_', ' ')}
                </Typography>
              </View>
            </View>
          </View>

          {/* Download status overlay */}
          {showDownloadStatus && item.downloadStatus !== 'not_downloaded' && (
            <View
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Icon
                name={getDownloadIcon(item.downloadStatus)}
                size={12}
                color={colors.onSurface}
              />
              {item.downloadStatus === 'downloading' && (
                <Typography variant="labelSmall" color="onSurface">
                  {Math.round(item.downloadProgress)}%
                </Typography>
              )}
            </View>
          )}
        </View>

        {/* Content info */}
        <View style={{ padding: 16, gap: 12 }}>
          <View>
            <Typography
              variant="titleMedium"
              color="onSurface"
              style={{ marginBottom: 4 }}
              numberOfLines={2}
            >
              {item.title}
            </Typography>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                {item.contentType.replace('_', ' ')}
              </Typography>
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                •
              </Typography>
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                {formatDuration(item.duration)}
              </Typography>
              {item.rating > 0 && (
                <>
                  <Typography variant="bodyMedium" color="onSurfaceVariant">
                    •
                  </Typography>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Icon name="star" size={14} color="#FFC107" />
                    <Typography variant="bodyMedium" color="onSurfaceVariant">
                      {item.rating.toFixed(1)}
                    </Typography>
                  </View>
                </>
              )}
            </View>

            <Typography
              variant="bodySmall"
              color="onSurfaceVariant"
              numberOfLines={2}
              style={{ marginBottom: 8 }}
            >
              {item.description}
            </Typography>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Typography variant="bodySmall" color="onSurfaceVariant">
                Added {formatDate(item.addedDate)}
              </Typography>
              {item.lastWatchedDate && (
                <>
                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    •
                  </Typography>
                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    Watched {formatDate(item.lastWatchedDate)}
                  </Typography>
                </>
              )}
            </View>
          </View>

          {/* Progress bar */}
          {showProgress && item.watchProgress > 0 && (
            <View>
              <WatchProgress
                progress={item.watchProgress}
                size="medium"
                showPercentage={true}
                style={{ marginBottom: 8 }}
              />
              <Typography variant="bodySmall" color="onSurfaceVariant">
                {Math.round(item.watchProgress)}% complete
              </Typography>
            </View>
          )}

          {/* Download progress */}
          {showDownloadStatus && item.downloadStatus === 'downloading' && (
            <View>
              <DownloadProgress
                progress={item.downloadProgress}
                size="medium"
                showPercentage={true}
                style={{ marginBottom: 8 }}
              />
              <Typography variant="bodySmall" color="onSurfaceVariant">
                Downloading...
              </Typography>
            </View>
          )}

          {/* Quick actions */}
          {showQuickActions && (
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('play')}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  paddingVertical: 8,
                  borderRadius: 8,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <Icon name="play_arrow" size={16} color={colors.onPrimary} />
                <Typography variant="labelLarge" color="onPrimary">
                  Play
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleQuickAction('favorite')}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: item.lists.includes('favorites') ? colors.secondaryContainer : colors.surfaceVariant,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name="favorite"
                  size={20}
                  color={item.lists.includes('favorites') ? colors.onSecondaryContainer : colors.onSurfaceVariant}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleQuickAction('download')}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: colors.surfaceVariant,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="download" size={20} color={colors.onSurfaceVariant} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleQuickAction('more')}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: colors.surfaceVariant,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="more_vert" size={20} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ElevatedCard>
    </TouchableOpacity>
  );

  const renderFeaturedCard = () => (
    <TouchableOpacity
      onPress={() => onPress?.(item)}
      activeOpacity={0.8}
      style={style}
    >
      <ElevatedCard
        style={{
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        {/* Large thumbnail */}
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            width: '100%',
            height: 240,
          }}
          resizeMode="cover"
        />

        {/* Gradient overlay for text readability */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'flex-end',
            padding: 16,
          }}
        >
          <Typography
            variant="headlineSmall"
            color="onSurface"
            style={{ marginBottom: 8 }}
            numberOfLines={2}
          >
            {item.title}
          </Typography>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Typography variant="bodyLarge" color="onSurface">
              {item.contentType.replace('_', ' ')}
            </Typography>
            <Typography variant="bodyLarge" color="onSurface">
              •
            </Typography>
            <Typography variant="bodyLarge" color="onSurface">
              {formatDuration(item.duration)}
            </Typography>
            {item.rating > 0 && (
              <>
                <Typography variant="bodyLarge" color="onSurface">
                  •
                </Typography>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Icon name="star" size={16} color="#FFC107" />
                  <Typography variant="bodyLarge" color="onSurface">
                    {item.rating.toFixed(1)}
                  </Typography>
                </View>
              </>
            )}
          </View>

          {showProgress && item.watchProgress > 0 && (
            <WatchProgress
              progress={item.watchProgress}
              size="medium"
              showPercentage={true}
            />
          )}
        </View>
      </ElevatedCard>
    </TouchableOpacity>
  );

  switch (variant) {
    case 'compact':
      return renderCompactCard();
    case 'featured':
      return renderFeaturedCard();
    default:
      return renderDefaultCard();
  }
};