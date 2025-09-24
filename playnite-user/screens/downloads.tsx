import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton, TextButton } from '../../shared/components/button';
import {
  DownloadItem,
  DownloadStatus,
  DownloadQuality,
  StorageInfo,
  DownloadQueue,
  DownloadFilter,
  DownloadSortOption,
} from '../types/downloads';

// Import components we'll create
import { DownloadQueueComponent } from '../components/download-queue';
import { StorageMeter } from '../components/storage-meter';
import { DownloadControls } from '../components/download-controls';
import { QualitySelector } from '../components/quality-selector';
import { DownloadProgress } from '../components/download-progress';

export const DownloadsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'library' | 'settings'>('queue');
  const [showQualitySelector, setShowQualitySelector] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<DownloadQuality>('HD');

  // Mock data - in real app this would come from state management
  const [downloadQueue, setDownloadQueue] = useState<DownloadQueue>({
    active: [
      {
        id: '1',
        contentId: 'content-1',
        title: 'Sample Movie Title',
        thumbnail: 'https://example.com/thumbnail.jpg',
        contentType: 'movie',
        quality: 'HD',
        fileSize: 2048576000, // 2GB
        downloadedSize: 1024000000, // 1GB
        status: 'downloading',
        progress: 50,
        downloadSpeed: 5242880, // 5MB/s
        estimatedTimeRemaining: 180, // 3 minutes
        createdAt: new Date(),
        updatedAt: new Date(),
        retryCount: 0,
        maxRetries: 3,
        isBackgroundDownload: false,
      },
    ],
    pending: [],
    completed: [
      {
        id: '2',
        contentId: 'content-2',
        title: 'Completed Download',
        thumbnail: 'https://example.com/thumbnail2.jpg',
        contentType: 'episode',
        quality: 'SD',
        fileSize: 524288000, // 500MB
        downloadedSize: 524288000,
        status: 'completed',
        progress: 100,
        downloadSpeed: 0,
        estimatedTimeRemaining: 0,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        updatedAt: new Date(Date.now() - 1800000), // 30 minutes ago
        filePath: '/downloads/completed-video.mp4',
        retryCount: 0,
        maxRetries: 3,
        isBackgroundDownload: false,
      },
    ],
    failed: [],
  });

  const [storageInfo] = useState<StorageInfo>({
    totalSpace: 107374182400, // 100GB
    usedSpace: 53687091200, // 50GB
    availableSpace: 53687091200, // 50GB
    downloadsSpace: 21474836480, // 20GB
    autoCleanupEnabled: true,
    cleanupThreshold: 80,
    oldestFirstCleanup: true,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleDownloadAction = (action: string, downloadId: string) => {
    console.log(`${action} download:`, downloadId);

    switch (action) {
      case 'pause':
        setDownloadQueue(prev => ({
          ...prev,
          active: prev.active.map(item =>
            item.id === downloadId
              ? { ...item, status: 'paused' as DownloadStatus }
              : item
          ),
        }));
        break;
      case 'resume':
        setDownloadQueue(prev => ({
          ...prev,
          active: prev.active.map(item =>
            item.id === downloadId
              ? { ...item, status: 'downloading' as DownloadStatus }
              : item
          ),
        }));
        break;
      case 'cancel':
        setDownloadQueue(prev => ({
          ...prev,
          active: prev.active.filter(item => item.id !== downloadId),
          pending: prev.pending.filter(item => item.id !== downloadId),
        }));
        break;
      case 'retry':
        setDownloadQueue(prev => ({
          ...prev,
          failed: prev.failed.filter(item => item.id !== downloadId),
          pending: [...prev.pending, {
            ...prev.failed.find(item => item.id === downloadId)!,
            status: 'pending' as DownloadStatus,
            retryCount: 0,
            errorMessage: undefined,
          }],
        }));
        break;
      case 'delete':
        setDownloadQueue(prev => ({
          ...prev,
          completed: prev.completed.filter(item => item.id !== downloadId),
        }));
        break;
    }
  };

  const handleBatchDownload = (contentIds: string[], quality: DownloadQuality) => {
    console.log('Batch download:', contentIds, quality);
    // Implementation would add multiple downloads to queue
  };

  const handleStorageCleanup = () => {
    Alert.alert(
      'Storage Cleanup',
      'Remove old downloads to free up space?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clean Up',
          style: 'destructive',
          onPress: () => {
            // Implementation would remove old downloads
            console.log('Storage cleanup initiated');
          },
        },
      ]
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'queue':
        return (
          <DownloadQueueComponent
            downloadQueue={downloadQueue}
            onDownloadAction={handleDownloadAction}
            onBatchDownload={handleBatchDownload}
          />
        );
      case 'library':
        return (
          <View style={styles.libraryContainer}>
            <StorageMeter
              storageInfo={storageInfo}
              onCleanup={handleStorageCleanup}
            />
            <View style={styles.section}>
              <Typography variant="titleLarge" color="onSurface" style={styles.sectionTitle}>
                Downloaded Content ({downloadQueue.completed.length})
              </Typography>
              {downloadQueue.completed.map((item) => (
                <Card key={item.id} style={styles.libraryItem}>
                  <View style={styles.libraryItemContent}>
                    <Typography variant="bodyLarge" color="onSurface">
                      {item.title}
                    </Typography>
                    <Typography variant="bodySmall" color="onSurfaceVariant">
                      {item.quality} • {item.contentType} • {(item.fileSize / 1024 / 1024 / 1024).toFixed(1)}GB
                    </Typography>
                    <View style={styles.libraryActions}>
                      <TextButton onPress={() => handleDownloadAction('delete', item.id)}>
                        Delete
                      </TextButton>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        );
      case 'settings':
        return (
          <View style={styles.settingsContainer}>
            <Card style={styles.settingsCard}>
              <Typography variant="titleMedium" color="onSurface" style={styles.settingsTitle}>
                Download Settings
              </Typography>

              <TouchableOpacity
                style={styles.settingsItem}
                onPress={() => setShowQualitySelector(true)}
              >
                <Typography variant="bodyLarge" color="onSurface">
                  Default Quality
                </Typography>
                <View style={styles.settingsItemRight}>
                  <Typography variant="bodyMedium" color="onSurfaceVariant">
                    {selectedQuality}
                  </Typography>
                  <Icon name="chevron_right" size={20} color={colors.onSurfaceVariant} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem}>
                <Typography variant="bodyLarge" color="onSurface">
                  Auto Cleanup
                </Typography>
                <View style={styles.settingsItemRight}>
                  <Typography variant="bodyMedium" color="onSurfaceVariant">
                    {storageInfo.autoCleanupEnabled ? 'Enabled' : 'Disabled'}
                  </Typography>
                  <Icon name="chevron_right" size={20} color={colors.onSurfaceVariant} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem}>
                <Typography variant="bodyLarge" color="onSurface">
                  Storage Threshold
                </Typography>
                <View style={styles.settingsItemRight}>
                  <Typography variant="bodyMedium" color="onSurfaceVariant">
                    {storageInfo.cleanupThreshold}%
                  </Typography>
                  <Icon name="chevron_right" size={20} color={colors.onSurfaceVariant} />
                </View>
              </TouchableOpacity>
            </Card>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppBar
        title="Downloads"
        leadingIcon="arrow_back"
        trailingIcons={['search', 'more_vert']}
        onLeadingIconPress={() => console.log('Back pressed')}
        onTrailingIconPress={(icon) => console.log(`${icon} pressed`)}
        elevated={true}
      />

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {[
          { key: 'queue', label: 'Queue', icon: 'download' },
          { key: 'library', label: 'Library', icon: 'video_library' },
          { key: 'settings', label: 'Settings', icon: 'settings' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && [styles.activeTab, { backgroundColor: colors.primaryContainer }],
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Icon
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.key ? colors.onPrimaryContainer : colors.onSurfaceVariant}
            />
            <Typography
              variant="bodySmall"
              color={activeTab === tab.key ? 'onPrimaryContainer' : 'onSurfaceVariant'}
              style={styles.tabLabel}
            >
              {tab.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {renderTabContent()}
      </ScrollView>

      {/* Quality Selector Modal */}
      <QualitySelector
        visible={showQualitySelector}
        selectedQuality={selectedQuality}
        onSelect={(quality) => {
          setSelectedQuality(quality);
          setShowQualitySelector(false);
        }}
        onClose={() => setShowQualitySelector(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: 'rgba(212, 17, 115, 0.1)',
  },
  tabLabel: {
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  libraryContainer: {
    padding: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  libraryItem: {
    marginBottom: 12,
    padding: 16,
  },
  libraryItemContent: {
    gap: 8,
  },
  libraryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  settingsContainer: {
    padding: 16,
  },
  settingsCard: {
    padding: 16,
  },
  settingsTitle: {
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});