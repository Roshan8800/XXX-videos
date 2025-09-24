import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card } from '../../shared/components';
import { PrimaryButton } from '../../shared/components/button';
import { StorageInfo } from '../types/downloads';

interface StorageMeterProps {
  storageInfo: StorageInfo;
  onCleanup: () => void;
}

export const StorageMeter: React.FC<StorageMeterProps> = ({
  storageInfo,
  onCleanup,
}) => {
  const { colors } = useTheme();

  const formatBytes = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getUsagePercentage = (): number => {
    return (storageInfo.usedSpace / storageInfo.totalSpace) * 100;
  };

  const getDownloadsPercentage = (): number => {
    return (storageInfo.downloadsSpace / storageInfo.totalSpace) * 100;
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return colors.error;
    if (percentage >= 75) return '#FFA726'; // Orange
    if (percentage >= 50) return '#FF9800'; // Light orange
    return colors.primary;
  };

  const usagePercentage = getUsagePercentage();
  const downloadsPercentage = getDownloadsPercentage();

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Typography variant="titleLarge" color="onSurface">
          Storage Usage
        </Typography>
        <Typography variant="bodyMedium" color="onSurfaceVariant">
          {formatBytes(storageInfo.availableSpace)} available
        </Typography>
      </View>

      {/* Storage Usage Bar */}
      <View style={styles.storageBar}>
        <View style={styles.storageBarBackground}>
          {/* Downloads usage */}
          <View
            style={[
              styles.storageBarSegment,
              {
                width: `${downloadsPercentage}%`,
                backgroundColor: colors.secondary,
              },
            ]}
          />
          {/* Other usage */}
          <View
            style={[
              styles.storageBarSegment,
              {
                width: `${usagePercentage - downloadsPercentage}%`,
                backgroundColor: getUsageColor(usagePercentage),
              },
            ]}
          />
        </View>
      </View>

      {/* Storage Details */}
      <View style={styles.storageDetails}>
        <View style={styles.storageDetail}>
          <View style={[styles.storageIndicator, { backgroundColor: colors.secondary }]} />
          <View style={styles.storageDetailText}>
            <Typography variant="bodySmall" color="onSurface">
              Downloads
            </Typography>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              {formatBytes(storageInfo.downloadsSpace)}
            </Typography>
          </View>
        </View>

        <View style={styles.storageDetail}>
          <View style={[styles.storageIndicator, { backgroundColor: getUsageColor(usagePercentage) }]} />
          <View style={styles.storageDetailText}>
            <Typography variant="bodySmall" color="onSurface">
              Other Files
            </Typography>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              {formatBytes(storageInfo.usedSpace - storageInfo.downloadsSpace)}
            </Typography>
          </View>
        </View>

        <View style={styles.storageDetail}>
          <View style={[styles.storageIndicator, { backgroundColor: colors.surfaceVariant }]} />
          <View style={styles.storageDetailText}>
            <Typography variant="bodySmall" color="onSurface">
              Available
            </Typography>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              {formatBytes(storageInfo.availableSpace)}
            </Typography>
          </View>
        </View>
      </View>

      {/* Storage Stats */}
      <View style={styles.storageStats}>
        <View style={styles.statItem}>
          <Typography variant="bodyLarge" color="onSurface">
            {usagePercentage.toFixed(1)}%
          </Typography>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            Used
          </Typography>
        </View>
        <View style={styles.statItem}>
          <Typography variant="bodyLarge" color="onSurface">
            {formatBytes(storageInfo.totalSpace)}
          </Typography>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            Total
          </Typography>
        </View>
        <View style={styles.statItem}>
          <Typography variant="bodyLarge" color="onSurface">
            {((storageInfo.availableSpace / storageInfo.totalSpace) * 100).toFixed(1)}%
          </Typography>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            Free
          </Typography>
        </View>
      </View>

      {/* Auto Cleanup Info */}
      {storageInfo.autoCleanupEnabled && (
        <View style={styles.cleanupInfo}>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            Auto cleanup enabled at {storageInfo.cleanupThreshold}% usage
          </Typography>
        </View>
      )}

      {/* Cleanup Button */}
      {usagePercentage >= 80 && (
        <View style={styles.cleanupContainer}>
          <PrimaryButton
            onPress={onCleanup}
            leftIcon="cleaning_services"
            style={styles.cleanupButton}
          >
            Free Up Space
          </PrimaryButton>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  storageBar: {
    marginBottom: 16,
  },
  storageBarBackground: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  storageBarSegment: {
    height: '100%',
  },
  storageDetails: {
    marginBottom: 16,
  },
  storageDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  storageDetailText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  cleanupInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 167, 38, 0.1)',
    borderRadius: 8,
  },
  cleanupContainer: {
    alignItems: 'center',
  },
  cleanupButton: {
    minWidth: 140,
  },
});