import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard } from '../../shared/components';
import { StreamStatus } from './stream-status';
import { Icon } from '../../shared/utils/icons';
import { StreamStatusType } from './live-stream-card';

export interface ScheduledStream {
  id: string;
  title: string;
  streamer: string;
  startTime: string;
  endTime?: string;
  duration: string;
  category: string;
  thumbnail?: string;
  description?: string;
  status: StreamStatusType;
  viewerCount?: number;
}

interface StreamScheduleProps {
  streams: ScheduledStream[];
  title?: string;
  showThumbnails?: boolean;
  compact?: boolean;
  onStreamPress?: (stream: ScheduledStream) => void;
}

export const StreamSchedule: React.FC<StreamScheduleProps> = ({
  streams,
  title = "Upcoming Streams",
  showThumbnails = false,
  compact = false,
  onStreamPress,
}) => {
  const { colors } = useTheme();

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeUntilStream = (startTime: string) => {
    const now = new Date();
    const streamTime = new Date(startTime);
    const diffMs = streamTime.getTime() - now.getTime();

    if (diffMs <= 0) return 'Starting soon';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  if (compact) {
    return (
      <Card style={{ padding: 16 }}>
        <Typography variant="titleMedium" color="onSurface" style={{ marginBottom: 12 }}>
          {title}
        </Typography>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {streams.map((stream) => (
            <View
              key={stream.id}
              style={{
                width: 200,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <StreamStatus status={stream.status} size="small" showLabel={false} />
                <Typography variant="labelSmall" color="onSurfaceVariant">
                  {formatTime(stream.startTime)}
                </Typography>
              </View>

              <Typography variant="bodyMedium" color="onSurface" numberOfLines={2} style={{ fontWeight: '600' }}>
                {stream.title}
              </Typography>

              <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginTop: 4 }}>
                {stream.streamer}
              </Typography>

              <Typography variant="labelSmall" color="onSurfaceVariant" style={{ marginTop: 4 }}>
                {stream.category} • {stream.duration}
              </Typography>
            </View>
          ))}
        </ScrollView>
      </Card>
    );
  }

  return (
    <ElevatedCard style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography variant="titleLarge" color="onSurface">
          {title}
        </Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="info" size={20} color={colors.onSurfaceVariant} />
          <Typography variant="bodySmall" color="onSurfaceVariant">
            {streams.length} streams
          </Typography>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {streams.map((stream, index) => (
          <View key={stream.id}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 8,
              }}
            >
              {/* Time Column */}
              <View style={{ width: 80, alignItems: 'center' }}>
                <Typography variant="titleMedium" color="onSurface" style={{ fontWeight: '600' }}>
                  {formatTime(stream.startTime)}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  {getTimeUntilStream(stream.startTime)}
                </Typography>
              </View>

              {/* Status Indicator */}
              <View style={{ width: 60, alignItems: 'center' }}>
                <StreamStatus status={stream.status} size="small" showLabel={false} />
              </View>

              {/* Content Column */}
              <View style={{ flex: 1 }}>
                <Typography variant="titleMedium" color="onSurface" numberOfLines={1} style={{ fontWeight: '600' }}>
                  {stream.title}
                </Typography>

                <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginTop: 2 }}>
                  {stream.streamer}
                </Typography>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    {stream.category}
                  </Typography>
                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    •
                  </Typography>
                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    {stream.duration}
                  </Typography>
                  {stream.viewerCount && stream.status === 'live' && (
                    <>
                      <Typography variant="bodySmall" color="onSurfaceVariant">
                        •
                      </Typography>
                      <Typography variant="bodySmall" color="onSurfaceVariant">
                        {stream.viewerCount.toLocaleString()} viewers
                      </Typography>
                    </>
                  )}
                </View>

                {stream.description && (
                  <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={2} style={{ marginTop: 4 }}>
                    {stream.description}
                  </Typography>
                )}
              </View>

              {/* Thumbnail */}
              {showThumbnails && stream.thumbnail && (
                <View style={{ width: 80, height: 60, marginLeft: 12 }}>
                  <Image
                    source={{ uri: stream.thumbnail }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                </View>
              )}
            </View>

            {/* Divider */}
            {index < streams.length - 1 && (
              <View style={{
                height: 1,
                backgroundColor: colors.outlineVariant,
                marginHorizontal: 16,
              }} />
            )}
          </View>
        ))}
      </ScrollView>
    </ElevatedCard>
  );
};

// Convenience components for different layouts
export const CompactStreamSchedule: React.FC<Omit<StreamScheduleProps, 'compact'>> = (props) => (
  <StreamSchedule compact={true} {...props} />
);

export const DetailedStreamSchedule: React.FC<Omit<StreamScheduleProps, 'compact'>> = (props) => (
  <StreamSchedule compact={false} {...props} />
);