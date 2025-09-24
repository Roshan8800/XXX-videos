import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { DownloadItem, DownloadStatus } from '../types/downloads';

interface DownloadControlsProps {
  download: DownloadItem;
  onAction: (action: string) => void;
  compact?: boolean;
}

export const DownloadControls: React.FC<DownloadControlsProps> = ({
  download,
  onAction,
  compact = false,
}) => {
  const { colors } = useTheme();

  const getAvailableActions = (): Array<{
    action: string;
    icon: string;
    label: string;
    color: string;
    disabled?: boolean;
  }> => {
    const actions = [];

    switch (download.status) {
      case 'downloading':
        actions.push({
          action: 'pause',
          icon: 'pause',
          label: 'Pause',
          color: colors.primary,
        });
        actions.push({
          action: 'cancel',
          icon: 'close',
          label: 'Cancel',
          color: colors.error,
        });
        break;

      case 'paused':
        actions.push({
          action: 'resume',
          icon: 'play_arrow',
          label: 'Resume',
          color: colors.primary,
        });
        actions.push({
          action: 'cancel',
          icon: 'close',
          label: 'Cancel',
          color: colors.error,
        });
        break;

      case 'pending':
        actions.push({
          action: 'cancel',
          icon: 'close',
          label: 'Cancel',
          color: colors.error,
        });
        break;

      case 'failed':
      case 'cancelled':
        actions.push({
          action: 'retry',
          icon: 'refresh',
          label: 'Retry',
          color: colors.primary,
        });
        break;

      case 'completed':
        actions.push({
          action: 'delete',
          icon: 'delete',
          label: 'Delete',
          color: colors.error,
        });
        break;
    }

    return actions;
  };

  const handleAction = (action: string) => {
    onAction(action);
  };

  const actions = getAvailableActions();

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.action}
            style={[styles.compactButton, { borderColor: action.color }]}
            onPress={() => handleAction(action.action)}
            disabled={action.disabled}
          >
            <Icon
              name={action.icon as any}
              size={16}
              color={action.disabled ? colors.onSurfaceVariant : action.color}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Typography variant="bodyLarge" color="onSurface">
          Download Controls
        </Typography>
        <Typography variant="bodySmall" color="onSurfaceVariant">
          {download.title}
        </Typography>
      </View>

      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.action}
            style={[styles.actionButton, { backgroundColor: action.color + '10' }]}
            onPress={() => handleAction(action.action)}
            disabled={action.disabled}
          >
            <Icon
              name={action.icon as any}
              size={20}
              color={action.disabled ? colors.onSurfaceVariant : action.color}
            />
            <Typography
              variant="bodySmall"
              color={action.disabled ? 'onSurfaceVariant' : 'onSurface'}
              style={styles.actionLabel}
            >
              {action.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Download Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            Status:
          </Typography>
          <Typography variant="bodySmall" color="onSurface">
            {download.status.charAt(0).toUpperCase() + download.status.slice(1)}
          </Typography>
        </View>

        <View style={styles.infoRow}>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            Quality:
          </Typography>
          <Typography variant="bodySmall" color="onSurface">
            {download.quality}
          </Typography>
        </View>

        <View style={styles.infoRow}>
          <Typography variant="bodySmall" color="onSurfaceVariant">
            Size:
          </Typography>
          <Typography variant="bodySmall" color="onSurface">
            {(download.fileSize / 1024 / 1024 / 1024).toFixed(1)} GB
          </Typography>
        </View>

        {download.downloadSpeed > 0 && (
          <View style={styles.infoRow}>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              Speed:
            </Typography>
            <Typography variant="bodySmall" color="onSurface">
              {(download.downloadSpeed / 1024 / 1024).toFixed(1)} MB/s
            </Typography>
          </View>
        )}

        {download.estimatedTimeRemaining > 0 && download.status === 'downloading' && (
          <View style={styles.infoRow}>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              Time Left:
            </Typography>
            <Typography variant="bodySmall" color="onSurface">
              {Math.floor(download.estimatedTimeRemaining / 60)}m {download.estimatedTimeRemaining % 60}s
            </Typography>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  compactContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  compactButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionLabel: {
    textAlign: 'center',
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});