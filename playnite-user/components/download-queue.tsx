import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ClickableCard } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton, TextButton } from '../../shared/components/button';
import { DownloadItem, DownloadQueue, DownloadQuality } from '../types/downloads';
import { DownloadProgress } from './download-progress';

interface DownloadQueueComponentProps {
  downloadQueue: DownloadQueue;
  onDownloadAction: (action: string, downloadId: string) => void;
  onBatchDownload: (contentIds: string[], quality: DownloadQuality) => void;
}

export const DownloadQueueComponent: React.FC<DownloadQueueComponentProps> = ({
  downloadQueue,
  onDownloadAction,
  onBatchDownload,
}) => {
  const { colors } = useTheme();

  const formatFileSize = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatSpeed = (bytesPerSecond: number): string => {
    if (bytesPerSecond === 0) return '0 B/s';
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(1024));
    return `${(bytesPerSecond / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloading':
        return colors.primary;
      case 'completed':
        return colors.tertiary;
      case 'failed':
        return colors.error;
      case 'paused':
        return colors.onSurfaceVariant;
      default:
        return colors.onSurfaceVariant;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'downloading':
        return 'download';
      case 'completed':
        return 'check_circle';
      case 'failed':
        return 'error';
      case 'paused':
        return 'pause_circle';
      case 'pending':
        return 'schedule';
      default:
        return 'help';
    }
  };

  const renderDownloadItem = (item: DownloadItem) => (
    <ClickableCard key={item.id} style={styles.downloadItem}>
      <View style={styles.downloadItemHeader}>
        <View style={styles.downloadItemInfo}>
          <Typography variant="bodyLarge" color="onSurface" numberOfLines={1}>
            {item.title}
          </Typography>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            {item.contentType} • {item.quality} • {formatFileSize(item.fileSize)}
          </Typography>
        </View>
        <View style={styles.downloadItemActions}>
          {item.status === 'downloading' && (
            <TouchableOpacity
              onPress={() => onDownloadAction('pause', item.id)}
              style={styles.actionButton}
            >
              <Icon name="pause" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          {item.status === 'paused' && (
            <TouchableOpacity
              onPress={() => onDownloadAction('resume', item.id)}
              style={styles.actionButton}
            >
              <Icon name="play_arrow" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          {(item.status === 'failed' || item.status === 'cancelled') && (
            <TouchableOpacity
              onPress={() => onDownloadAction('retry', item.id)}
              style={styles.actionButton}
            >
              <Icon name="refresh" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => onDownloadAction('cancel', item.id)}
            style={styles.actionButton}
          >
            <Icon name="close" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.downloadItemProgress}>
        <DownloadProgress
          progress={item.progress}
          status={item.status}
          downloadSpeed={item.downloadSpeed}
          estimatedTimeRemaining={item.estimatedTimeRemaining}
        />

        <View style={styles.downloadItemDetails}>
          <View style={styles.downloadItemStatus}>
            <Icon
              name={getStatusIcon(item.status) as any}
              size={16}
              color={getStatusColor(item.status)}
            />
            <Typography variant="bodySmall" color={getStatusColor(item.status)}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Typography>
          </View>

          <View style={styles.downloadItemStats}>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              {formatFileSize(item.downloadedSize)} / {formatFileSize(item.fileSize)}
            </Typography>
            {item.downloadSpeed > 0 && (
              <Typography variant="bodySmall" color="onSurfaceVariant">
                {formatSpeed(item.downloadSpeed)}
              </Typography>
            )}
            {item.estimatedTimeRemaining > 0 && item.status === 'downloading' && (
              <Typography variant="bodySmall" color="onSurfaceVariant">
                {formatTime(item.estimatedTimeRemaining)} left
              </Typography>
            )}
          </View>
        </View>

        {item.errorMessage && (
          <View style={styles.errorContainer}>
            <Typography variant="bodySmall" color="error">
              {item.errorMessage}
            </Typography>
          </View>
        )}
      </View>
    </ClickableCard>
  );

  const renderSection = (title: string, items: DownloadItem[], emptyMessage: string) => (
    <View style={styles.section}>
      <Typography variant="titleMedium" color="onSurface" style={styles.sectionTitle}>
        {title} ({items.length})
      </Typography>
      {items.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Typography variant="bodyLarge" color="onSurfaceVariant" style={styles.emptyText}>
            {emptyMessage}
          </Typography>
        </Card>
      ) : (
        items.map(renderDownloadItem)
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Active Downloads */}
      {renderSection(
        'Active Downloads',
        downloadQueue.active,
        'No active downloads'
      )}

      {/* Pending Downloads */}
      {renderSection(
        'Pending Downloads',
        downloadQueue.pending,
        'No pending downloads'
      )}

      {/* Completed Downloads */}
      {renderSection(
        'Recently Completed',
        downloadQueue.completed.slice(0, 5),
        'No completed downloads'
      )}

      {/* Failed Downloads */}
      {renderSection(
        'Failed Downloads',
        downloadQueue.failed,
        'No failed downloads'
      )}

      {/* Batch Download Button */}
      <View style={styles.batchDownloadContainer}>
        <SecondaryButton
          onPress={() => console.log('Open batch download')}
          leftIcon="playlist_add"
          style={styles.batchDownloadButton}
        >
          Add to Queue
        </SecondaryButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  downloadItem: {
    marginBottom: 12,
    padding: 16,
  },
  downloadItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  downloadItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  downloadItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  downloadItemProgress: {
    gap: 8,
  },
  downloadItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  downloadItemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  downloadItemStats: {
    flexDirection: 'row',
    gap: 12,
  },
  errorContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    borderRadius: 4,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  batchDownloadContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  batchDownloadButton: {
    alignSelf: 'center',
  },
});