export type DownloadStatus = 'pending' | 'downloading' | 'paused' | 'completed' | 'failed' | 'cancelled';

export type DownloadQuality = '4K' | 'HD' | 'SD' | 'Audio Only';

export type ContentType = 'movie' | 'episode' | 'clip' | 'live_stream';

export interface DownloadItem {
  id: string;
  contentId: string;
  title: string;
  thumbnail: string;
  contentType: ContentType;
  quality: DownloadQuality;
  fileSize: number; // in bytes
  downloadedSize: number; // in bytes
  status: DownloadStatus;
  progress: number; // 0-100
  downloadSpeed: number; // bytes per second
  estimatedTimeRemaining: number; // seconds
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  filePath?: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  isBackgroundDownload: boolean;
  parentalRating?: string;
}

export interface StorageInfo {
  totalSpace: number; // in bytes
  usedSpace: number; // in bytes
  availableSpace: number; // in bytes
  downloadsSpace: number; // in bytes
  autoCleanupEnabled: boolean;
  cleanupThreshold: number; // percentage
  oldestFirstCleanup: boolean;
}

export interface DownloadSettings {
  maxConcurrentDownloads: number;
  defaultQuality: DownloadQuality;
  autoDownloadQuality: boolean;
  downloadOnWifiOnly: boolean;
  smartDownloadsEnabled: boolean;
  maxSmartDownloads: number;
  downloadScheduleEnabled: boolean;
  downloadScheduleStart: string; // HH:MM format
  downloadScheduleEnd: string; // HH:MM format
  parentalControlsEnabled: boolean;
  allowedRatings: string[];
  backgroundDownloadsEnabled: boolean;
  autoCleanupEnabled: boolean;
  cleanupThreshold: number;
  oldestFirstCleanup: boolean;
}

export interface DownloadAnalytics {
  totalDownloads: number;
  successfulDownloads: number;
  failedDownloads: number;
  averageDownloadSpeed: number;
  totalDataDownloaded: number;
  downloadSuccessRate: number;
  peakDownloadSpeed: number;
  averageDownloadTime: number;
}

export interface DownloadQueue {
  active: DownloadItem[];
  pending: DownloadItem[];
  completed: DownloadItem[];
  failed: DownloadItem[];
}

export interface BatchDownloadRequest {
  contentIds: string[];
  quality: DownloadQuality;
  contentType: ContentType;
  isBackgroundDownload: boolean;
}

export interface DownloadFilter {
  status?: DownloadStatus[];
  contentType?: ContentType[];
  quality?: DownloadQuality[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

export interface DownloadSortOption {
  field: 'title' | 'createdAt' | 'fileSize' | 'progress' | 'status';
  direction: 'asc' | 'desc';
}