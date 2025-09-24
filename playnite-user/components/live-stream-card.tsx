import React from 'react';
import { View, Image, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ClickableCard } from '../../shared/components';
import { StreamStatus } from './stream-status';
import { ViewerCounter } from './viewer-counter';
import { Icon } from '../../shared/utils/icons';

export type StreamStatusType = 'live' | 'upcoming' | 'ended' | 'offline';

export interface LiveStreamData {
  id: string;
  title: string;
  streamer: string;
  thumbnail: string;
  category: string;
  status: StreamStatusType;
  viewerCount: number;
  startTime?: string;
  duration?: string;
  description?: string;
  tags?: string[];
}

interface LiveStreamCardProps extends TouchableOpacityProps {
  stream: LiveStreamData;
  size?: 'small' | 'medium' | 'large';
  showDescription?: boolean;
  showTags?: boolean;
  onPress?: () => void;
}

export const LiveStreamCard: React.FC<LiveStreamCardProps> = ({
  stream,
  size = 'medium',
  showDescription = false,
  showTags = false,
  onPress,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const getCardDimensions = () => {
    switch (size) {
      case 'small':
        return {
          width: 160,
          height: 120,
          thumbnailHeight: 90,
        };
      case 'large':
        return {
          width: 320,
          height: 240,
          thumbnailHeight: 180,
        };
      default: // medium
        return {
          width: 280,
          height: 200,
          thumbnailHeight: 160,
        };
    }
  };

  const dimensions = getCardDimensions();

  const CardComponent = onPress ? ClickableCard : Card;

  return (
    <CardComponent
      style={[
        {
          width: dimensions.width,
          marginRight: 16,
        },
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      {/* Thumbnail with overlay indicators */}
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: stream.thumbnail }}
          style={{
            width: '100%',
            height: dimensions.thumbnailHeight,
            borderRadius: 12,
          }}
          resizeMode="cover"
        />

        {/* Status indicator */}
        <View style={{
          position: 'absolute',
          top: 8,
          left: 8,
        }}>
          <StreamStatus
            status={stream.status}
            size="small"
            showLabel={size !== 'small'}
          />
        </View>

        {/* Live viewer count */}
        {stream.status === 'live' && (
          <View style={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}>
            <ViewerCounter
              viewerCount={stream.viewerCount}
              size="small"
              showLabel={size !== 'small'}
            />
          </View>
        )}

        {/* Play button overlay for live streams */}
        {stream.status === 'live' && (
          <View style={{
            position: 'absolute',
            inset: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}>
            <View style={{
              backgroundColor: 'rgba(255, 0, 0, 0.9)',
              borderRadius: 30,
              padding: 12,
            }}>
              <Icon name="play_circle" size={32} color="white" />
            </View>
          </View>
        )}

        {/* Duration badge for upcoming/ended streams */}
        {(stream.status === 'upcoming' || stream.status === 'ended') && stream.duration && (
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
              {stream.duration}
            </Typography>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{ marginTop: 12, flex: 1 }}>
        {/* Title */}
        <Typography
          variant={size === 'small' ? 'bodySmall' : 'titleMedium'}
          color="onSurface"
          numberOfLines={2}
          style={{ fontWeight: '600' }}
        >
          {stream.title}
        </Typography>

        {/* Streamer */}
        <Typography
          variant="bodySmall"
          color="onSurfaceVariant"
          style={{ marginTop: 4 }}
        >
          {stream.streamer}
        </Typography>

        {/* Category */}
        <View style={{
          backgroundColor: colors.secondaryContainer,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 12,
          alignSelf: 'flex-start',
          marginTop: 6,
        }}>
          <Typography
            variant="labelSmall"
            color="onSecondaryContainer"
          >
            {stream.category}
          </Typography>
        </View>

        {/* Description */}
        {showDescription && stream.description && (
          <Typography
            variant="bodySmall"
            color="onSurfaceVariant"
            numberOfLines={2}
            style={{ marginTop: 8 }}
          >
            {stream.description}
          </Typography>
        )}

        {/* Tags */}
        {showTags && stream.tags && stream.tags.length > 0 && (
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 4,
            marginTop: 8,
          }}>
            {stream.tags.slice(0, 3).map((tag, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.surfaceVariant,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 8,
                }}
              >
                <Typography variant="labelSmall" color="onSurfaceVariant">
                  {tag}
                </Typography>
              </View>
            ))}
          </View>
        )}

        {/* Start time for upcoming streams */}
        {stream.status === 'upcoming' && stream.startTime && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            gap: 4,
          }}>
            <Icon name="info" size={14} color={colors.onSurfaceVariant} />
            <Typography variant="bodySmall" color="onSurfaceVariant">
              Starts {stream.startTime}
            </Typography>
          </View>
        )}
      </View>
    </CardComponent>
  );
};

// Convenience components for different sizes
export const SmallLiveStreamCard: React.FC<Omit<LiveStreamCardProps, 'size'>> = (props) => (
  <LiveStreamCard size="small" {...props} />
);

export const MediumLiveStreamCard: React.FC<Omit<LiveStreamCardProps, 'size'>> = (props) => (
  <LiveStreamCard size="medium" {...props} />
);

export const LargeLiveStreamCard: React.FC<Omit<LiveStreamCardProps, 'size'>> = (props) => (
  <LiveStreamCard size="large" {...props} />
);