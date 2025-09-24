export type WatchlistType = 'watchlist' | 'favorites' | 'watched' | 'custom';

export type ContentType = 'movie' | 'tv_show' | 'documentary' | 'short_film' | 'series';

export type WatchStatus = 'not_started' | 'in_progress' | 'completed' | 'dropped';

export type DownloadStatus = 'not_downloaded' | 'downloading' | 'downloaded' | 'error';

export interface WatchlistItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  contentType: ContentType;
  duration: number; // in minutes
  rating: number;
  releaseDate: string;
  genres: string[];
  cast: string[];
  director: string;
  addedDate: string;
  lastWatchedDate?: string;
  watchStatus: WatchStatus;
  watchProgress: number; // percentage 0-100
  downloadStatus: DownloadStatus;
  downloadProgress: number; // percentage 0-100
  isPremium: boolean;
  isNew: boolean;
  viewCount: number;
  customTags: string[];
  notes?: string;
  lists: WatchlistType[];
  priority: 'low' | 'medium' | 'high';
}

export interface WatchlistList {
  id: string;
  name: string;
  type: WatchlistType;
  description?: string;
  color: string;
  icon: string;
  isDefault: boolean;
  isPrivate: boolean;
  itemCount: number;
  createdDate: string;
  lastModified: string;
}

export interface WatchlistFilters {
  contentTypes: ContentType[];
  genres: string[];
  rating: { min: number; max: number };
  duration: { min: number; max: number };
  releaseYear: { min: number; max: number };
  watchStatus: WatchStatus[];
  downloadStatus: DownloadStatus[];
  isPremium?: boolean;
  isNew?: boolean;
  priority: ('low' | 'medium' | 'high')[];
  customTags: string[];
  lists: WatchlistType[];
}

export interface WatchlistSort {
  field: 'addedDate' | 'title' | 'rating' | 'releaseDate' | 'duration' | 'lastWatchedDate' | 'priority';
  order: 'asc' | 'desc';
}

export interface WatchlistStats {
  totalItems: number;
  watchedItems: number;
  favoriteItems: number;
  totalWatchTime: number; // in minutes
  averageRating: number;
  completionRate: number; // percentage
  genreBreakdown: Record<string, number>;
  contentTypeBreakdown: Record<ContentType, number>;
  monthlyStats: {
    month: string;
    itemsAdded: number;
    itemsWatched: number;
    watchTime: number;
  }[];
}

export interface BulkAction {
  type: 'remove' | 'move' | 'download' | 'mark_watched' | 'mark_favorite' | 'set_priority' | 'add_tag' | 'remove_tag';
  targetList?: WatchlistType;
  priority?: 'low' | 'medium' | 'high';
  tag?: string;
  itemIds: string[];
}

export interface WatchlistSettings {
  autoAddToWatchlist: boolean;
  autoRemoveWatched: boolean;
  defaultSort: WatchlistSort;
  showProgress: boolean;
  showDownloadStatus: boolean;
  enableNotifications: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  privacy: {
    watchlistVisible: boolean;
    favoritesVisible: boolean;
    watchedVisible: boolean;
    statsVisible: boolean;
  };
  smartCategories: {
    enabled: boolean;
    autoCategorize: boolean;
    suggestedTags: boolean;
  };
}

export interface WatchlistRecommendation {
  id: string;
  title: string;
  thumbnail: string;
  reason: string;
  similarity: number; // percentage
  contentType: ContentType;
  rating: number;
  duration: number;
  genres: string[];
}