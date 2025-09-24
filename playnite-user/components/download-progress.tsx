import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { DownloadStatus } from '../types/downloads';

interface DownloadProgressProps {
  progress: number;
  status: DownloadStatus;
  downloadSpeed: number;
  estimatedTimeRemaining: number;
}

export const DownloadProgress: React.FC<DownloadProgressProps> = ({
  progress,
  status,
  downloadSpeed,
  estimatedTimeRemaining,
}) => {
  const { colors } = useTheme();

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

  const getProgressColor = (): string => {
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

  const getProgressBackgroundColor = (): string => {
    switch (status) {
      case 'completed':
        return 'rgba(76, 175, 80, 0.2)';
      case 'failed':
        return 'rgba(244, 67, 54, 0.2)';
      case 'paused':
        return 'rgba(0, 0, 0, 0.1)';
      default:
        return 'rgba(0, 0, 0, 0.1)';
    }
  };

  const renderProgressBar = () => {
    if (status === 'completed') {
      return (
        <View style={[styles.progressBar, { backgroundColor: getProgressBackgroundColor() }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: getProgressColor(), width: '100%' },
            ]}
          />
        </View>
      );
    }

    if (status === 'failed' || status === 'cancelled') {
      return (
        <View style={[styles.progressBar, { backgroundColor: getProgressBackgroundColor() }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: getProgressColor(), width: `${progress}%` },
            ]}
          />
        </View>
      );
    }

    return (
      <View style={[styles.progressBar, { backgroundColor: getProgressBackgroundColor() }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: getProgressColor(),
              width: `${Math.min(progress, 100)}%`,
            },
          ]}
        />
      </View>
    );
  };

  const renderProgressInfo = () => {
    if (status === 'completed') {
      return (
        <View style={styles.progressInfo}>
          <Typography variant="bodySmall" color="tertiary">
            Download completed
          </Typography>
        </View>
      );
    }

    if (status === 'failed' || status === 'cancelled') {
      return (
        <View style={styles.progressInfo}>
          <Typography variant="bodySmall" color="error">
            {status === 'failed' ? 'Download failed' : 'Download cancelled'}
          </Typography>
        </View>
      );
    }

    if (status === 'paused') {
      return (
        <View style={styles.progressInfo}>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            Download paused
          </Typography>
        </View>
      );
    }

    if (status === 'pending') {
      return (
        <View style={styles.progressInfo}>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            Waiting to start...
          </Typography>
        </View>
      );
    }

    // Downloading state
    return (
      <View style={styles.progressInfo}>
        <View style={styles.progressText}>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            {progress.toFixed(0)}%
          </Typography>
          {downloadSpeed > 0 && (
            <Typography variant="bodySmall" color="onSurfaceVariant">
              {formatSpeed(downloadSpeed)}
            </Typography>
          )}
        </View>
        {estimatedTimeRemaining > 0 && (
          <Typography variant="bodySmall" color="onSurfaceVariant">
            {formatTime(estimatedTimeRemaining)} remaining
          </Typography>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderProgressBar()}
      {renderProgressInfo()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    flexDirection: 'row',
    gap: 12,
  },
});