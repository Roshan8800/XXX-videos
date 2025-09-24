import React from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton, TextButton } from '../../shared/components/button';
import { WatchlistTabs, getDefaultWatchlistTabs } from '../components/watchlist-tabs';
import { WatchlistCard } from '../components/watchlist-card';
import { WatchlistActions } from '../components/watchlist-actions';
import { BulkActions, SelectionToolbar } from '../components/bulk-actions';
import { WatchlistItem, WatchlistType, WatchlistFilters, WatchlistSort, BulkAction } from '../types/watchlist';

interface WatchlistScreenProps {
  // Navigation props would be passed here in a real implementation
}

export const WatchlistScreen: React.FC<WatchlistScreenProps> = () => {
  const { colors } = useTheme();
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;

  // State management
  const [activeTab, setActiveTab] = React.useState<WatchlistType>('watchlist');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = React.useState(false);
  const [showSortOptions, setShowSortOptions] = React.useState(false);
  const [isSelectionMode, setIsSelectionMode] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  // Filter and sort state
  const [filters, setFilters] = React.useState<WatchlistFilters>({
    contentTypes: [],
    genres: [],
    rating: { min: 0, max: 5 },
    duration: { min: 0, max: 300 },
    releaseYear: { min: 2000, max: new Date().getFullYear() },
    watchStatus: [],
    downloadStatus: [],
    priority: [],
    customTags: [],
    lists: [],
  });

  const [sort, setSort] = React.useState<WatchlistSort>({
    field: 'addedDate',
    order: 'desc',
  });

  // Sample watchlist data
  const [watchlistItems, setWatchlistItems] = React.useState<WatchlistItem[]>([
    {
      id: '1',
      title: 'The Dark Knight',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
      thumbnail: 'https://via.placeholder.com/300x200/333/fff?text=Dark+Knight',
      contentType: 'movie',
      duration: 152,
      rating: 4.8,
      releaseDate: '2008-07-18',
      genres: ['Action', 'Crime', 'Drama'],
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
      director: 'Christopher Nolan',
      addedDate: '2024-01-15',
      lastWatchedDate: '2024-01-20',
      watchStatus: 'completed',
      watchProgress: 100,
      downloadStatus: 'downloaded',
      downloadProgress: 100,
      isPremium: false,
      isNew: false,
      viewCount: 3,
      customTags: ['superhero', 'nolan'],
      lists: ['watchlist', 'favorites'],
      priority: 'high',
    },
    {
      id: '2',
      title: 'Breaking Bad',
      description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.',
      thumbnail: 'https://via.placeholder.com/300x200/333/fff?text=Breaking+Bad',
      contentType: 'tv_show',
      duration: 47,
      rating: 4.9,
      releaseDate: '2008-01-20',
      genres: ['Crime', 'Drama', 'Thriller'],
      cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
      director: 'Vince Gilligan',
      addedDate: '2024-01-10',
      watchStatus: 'in_progress',
      watchProgress: 75,
      downloadStatus: 'downloading',
      downloadProgress: 45,
      isPremium: true,
      isNew: false,
      viewCount: 12,
      customTags: ['drama', 'intense'],
      lists: ['watchlist'],
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
      thumbnail: 'https://via.placeholder.com/300x200/333/fff?text=Inception',
      contentType: 'movie',
      duration: 148,
      rating: 4.7,
      releaseDate: '2010-07-16',
      genres: ['Action', 'Sci-Fi', 'Thriller'],
      cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy'],
      director: 'Christopher Nolan',
      addedDate: '2024-01-22',
      watchStatus: 'not_started',
      watchProgress: 0,
      downloadStatus: 'not_downloaded',
      downloadProgress: 0,
      isPremium: false,
      isNew: true,
      viewCount: 0,
      customTags: ['mind-bending', 'nolan'],
      lists: ['watchlist'],
      priority: 'low',
    },
    {
      id: '4',
      title: 'The Office',
      description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
      thumbnail: 'https://via.placeholder.com/300x200/333/fff?text=The+Office',
      contentType: 'tv_show',
      duration: 22,
      rating: 4.5,
      releaseDate: '2005-03-24',
      genres: ['Comedy', 'Mockumentary'],
      cast: ['Steve Carell', 'John Krasinski', 'Jenna Fischer'],
      director: 'Greg Daniels',
      addedDate: '2024-01-18',
      lastWatchedDate: '2024-01-25',
      watchStatus: 'completed',
      watchProgress: 100,
      downloadStatus: 'downloaded',
      downloadProgress: 100,
      isPremium: false,
      isNew: false,
      viewCount: 25,
      customTags: ['comedy', 'workplace'],
      lists: ['watched', 'favorites'],
      priority: 'medium',
    },
  ]);

  // Filter items based on active tab and filters
  const getFilteredItems = React.useCallback(() => {
    let filtered = watchlistItems.filter(item => item.lists.includes(activeTab));

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.genres.some(g => g.toLowerCase().includes(query)) ||
        item.cast.some(c => c.toLowerCase().includes(query))
      );
    }

    // Apply other filters
    if (filters.contentTypes.length > 0) {
      filtered = filtered.filter(item => filters.contentTypes.includes(item.contentType));
    }

    if (filters.genres.length > 0) {
      filtered = filtered.filter(item =>
        item.genres.some(genre => filters.genres.includes(genre))
      );
    }

    if (filters.rating.min > 0 || filters.rating.max < 5) {
      filtered = filtered.filter(item =>
        item.rating >= filters.rating.min && item.rating <= filters.rating.max
      );
    }

    if (filters.watchStatus.length > 0) {
      filtered = filtered.filter(item => filters.watchStatus.includes(item.watchStatus));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          break;
        case 'releaseDate':
          comparison = new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
          break;
        case 'duration':
          comparison = b.duration - a.duration;
          break;
        case 'addedDate':
          comparison = new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
          break;
        case 'lastWatchedDate':
          if (!a.lastWatchedDate && !b.lastWatchedDate) comparison = 0;
          else if (!a.lastWatchedDate) comparison = 1;
          else if (!b.lastWatchedDate) comparison = -1;
          else comparison = new Date(b.lastWatchedDate).getTime() - new Date(a.lastWatchedDate).getTime();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        default:
          comparison = 0;
      }

      return sort.order === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }, [watchlistItems, activeTab, searchQuery, filters, sort]);

  const filteredItems = getFilteredItems();

  // Get item counts for tabs
  const getItemCounts = () => {
    const counts: Record<WatchlistType, number> = {
      watchlist: watchlistItems.filter(item => item.lists.includes('watchlist')).length,
      favorites: watchlistItems.filter(item => item.lists.includes('favorites')).length,
      watched: watchlistItems.filter(item => item.lists.includes('watched')).length,
      custom: watchlistItems.filter(item => item.lists.includes('custom')).length,
    };
    return counts;
  };

  const itemCounts = getItemCounts();

  // Event handlers
  const handleTabChange = (tabId: WatchlistType) => {
    setActiveTab(tabId);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const handleItemPress = (item: WatchlistItem) => {
    if (isSelectionMode) {
      toggleItemSelection(item);
    } else {
      console.log('Watchlist item pressed:', item.title);
      // Navigate to item details
    }
  };

  const handleQuickAction = (action: string, item: WatchlistItem) => {
    console.log('Quick action:', action, 'on item:', item.title);

    switch (action) {
      case 'play':
        console.log('Playing:', item.title);
        break;
      case 'favorite':
        toggleFavorite(item);
        break;
      case 'download':
        handleDownload(item);
        break;
      case 'share':
        console.log('Sharing:', item.title);
        break;
      case 'more':
        showItemMenu(item);
        break;
    }
  };

  const handleDownload = (item: WatchlistItem) => {
    if (item.downloadStatus === 'downloaded') {
      Alert.alert('Already Downloaded', `${item.title} is already downloaded.`);
      return;
    }

    // Simulate download
    const updatedItems = watchlistItems.map(watchlistItem =>
      watchlistItem.id === item.id
        ? { ...watchlistItem, downloadStatus: 'downloading' as const, downloadProgress: 0 }
        : watchlistItem
    );
    setWatchlistItems(updatedItems);

    // Simulate download progress
    const interval = setInterval(() => {
      setWatchlistItems(prevItems =>
        prevItems.map(watchlistItem => {
          if (watchlistItem.id === item.id && watchlistItem.downloadStatus === 'downloading') {
            const newProgress = Math.min(watchlistItem.downloadProgress + 10, 100);
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...watchlistItem, downloadStatus: 'downloaded', downloadProgress: 100 };
            }
            return { ...watchlistItem, downloadProgress: newProgress };
          }
          return watchlistItem;
        })
      );
    }, 500);
  };

  const toggleFavorite = (item: WatchlistItem) => {
    const updatedItems = watchlistItems.map(watchlistItem => {
      if (watchlistItem.id === item.id) {
        const isFavorite = watchlistItem.lists.includes('favorites');
        const newLists = isFavorite
          ? watchlistItem.lists.filter(list => list !== 'favorites')
          : [...watchlistItem.lists, 'favorites' as WatchlistType];

        return { ...watchlistItem, lists: newLists };
      }
      return watchlistItem;
    });
    setWatchlistItems(updatedItems);
  };

  const showItemMenu = (item: WatchlistItem) => {
    Alert.alert(
      item.title,
      'Choose an action',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add to List', onPress: () => console.log('Add to list') },
        { text: 'Remove from List', onPress: () => removeFromList(item) },
        { text: 'Mark as Watched', onPress: () => markAsWatched(item) },
        { text: 'Edit Details', onPress: () => console.log('Edit details') },
      ]
    );
  };

  const removeFromList = (item: WatchlistItem) => {
    const updatedItems = watchlistItems.map(watchlistItem => {
      if (watchlistItem.id === item.id) {
        const newLists = watchlistItem.lists.filter(list => list !== activeTab) as WatchlistType[];
        return { ...watchlistItem, lists: newLists };
      }
      return watchlistItem;
    });
    setWatchlistItems(updatedItems);
  };

  const markAsWatched = (item: WatchlistItem) => {
    const updatedItems = watchlistItems.map(watchlistItem => {
      if (watchlistItem.id === item.id) {
        return {
          ...watchlistItem,
          watchStatus: 'completed' as const,
          watchProgress: 100,
          lastWatchedDate: new Date().toISOString(),
          lists: [...watchlistItem.lists, 'watched' as WatchlistType],
        };
      }
      return watchlistItem;
    });
    setWatchlistItems(updatedItems);
  };

  const toggleItemSelection = (item: WatchlistItem) => {
    setSelectedItems(prev =>
      prev.find(selected => selected.id === item.id)
        ? prev.filter(selected => selected.id !== item.id)
        : [...prev, item]
    );
  };

  const handleBulkAction = (action: BulkAction) => {
    console.log('Bulk action:', action);

    // Handle bulk actions
    switch (action.type) {
      case 'remove':
        const updatedItems = watchlistItems.filter(item =>
          !action.itemIds.includes(item.id)
        );
        setWatchlistItems(updatedItems);
        break;
      case 'mark_watched':
        const watchedItems = watchlistItems.map(item =>
          action.itemIds.includes(item.id)
            ? {
                ...item,
                watchStatus: 'completed' as const,
                watchProgress: 100,
                lastWatchedDate: new Date().toISOString(),
                lists: [...item.lists, 'watched' as WatchlistType],
              }
            : item
        );
        setWatchlistItems(watchedItems);
        break;
      case 'mark_favorite':
        const favoriteItems = watchlistItems.map(item =>
          action.itemIds.includes(item.id)
            ? { ...item, lists: [...item.lists, 'favorites' as WatchlistType] }
            : item
        );
        setWatchlistItems(favoriteItems);
        break;
    }

    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const handleSelectAll = () => {
    setSelectedItems(filteredItems);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedItems([]);
    }
  };

  // Render search bar
  const renderSearchBar = () => (
    <View style={{
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceVariant,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}>
        <Icon name="search" size={20} color={colors.onSurfaceVariant} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search your watchlist..."
          placeholderTextColor={colors.onSurfaceVariant}
          style={{
            flex: 1,
            marginLeft: 12,
            fontSize: 16,
            color: colors.onSurface,
          }}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Render controls
  const renderControls = () => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
    }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <SecondaryButton
          onPress={() => setShowFilters(!showFilters)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Icon name="filter_list" size={18} color={colors.onSurface} />
          <Typography variant="labelLarge" color="onSurface">
            Filter
          </Typography>
        </SecondaryButton>

        <SecondaryButton
          onPress={() => setShowSortOptions(!showSortOptions)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Icon name="sort" size={18} color={colors.onSurface} />
          <Typography variant="labelLarge" color="onSurface">
            Sort
          </Typography>
        </SecondaryButton>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={() => setViewMode('grid')}
          style={{
            padding: 8,
            backgroundColor: viewMode === 'grid' ? colors.primary + '20' : colors.surfaceVariant,
            borderRadius: 8,
          }}
        >
          <Icon
            name="category"
            size={20}
            color={viewMode === 'grid' ? colors.primary : colors.onSurfaceVariant}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setViewMode('list')}
          style={{
            padding: 8,
            backgroundColor: viewMode === 'list' ? colors.primary + '20' : colors.surfaceVariant,
            borderRadius: 8,
          }}
        >
          <Icon
            name="menu"
            size={20}
            color={viewMode === 'list' ? colors.primary : colors.onSurfaceVariant}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleSelectionMode}
          style={{
            padding: 8,
            backgroundColor: isSelectionMode ? colors.primary + '20' : colors.surfaceVariant,
            borderRadius: 8,
          }}
        >
          <Icon
            name="check_circle"
            size={20}
            color={isSelectionMode ? colors.primary : colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render content
  const renderContent = () => {
    if (filteredItems.length === 0) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 64,
        }}>
          <Icon name="add" size={64} color={colors.onSurfaceVariant} />
          <Typography variant="headlineSmall" color="onSurface" style={{ marginTop: 16, marginBottom: 8 }}>
            Your {activeTab} is empty
          </Typography>
          <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ textAlign: 'center', marginBottom: 24 }}>
            Add some content to your {activeTab} to get started.
          </Typography>
          <SecondaryButton onPress={() => console.log('Browse content')}>
            Browse Content
          </SecondaryButton>
        </View>
      );
    }

    const numColumns = viewMode === 'grid' ? (isTablet ? 3 : 2) : 1;

    return (
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={{
            flex: 1 / numColumns,
            padding: 8,
          }}>
            <WatchlistCard
              item={item}
              variant={viewMode === 'list' ? 'compact' : 'default'}
              showProgress={true}
              showDownloadStatus={true}
              showQuickActions={!isSelectionMode}
              onPress={handleItemPress}
              onQuickAction={handleQuickAction}
            />
          </View>
        )}
        onEndReached={() => {
          if (hasMore && !isLoading) {
            // Load more items
            console.log('Load more items');
          }
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isLoading ? (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                Loading...
              </Typography>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppBar
        title="My Watchlist"
        leadingIcon="arrow_back"
        trailingIcons={['notifications', 'settings']}
        onLeadingIconPress={() => console.log('Back pressed')}
        onTrailingIconPress={(icon) => console.log(`${icon} pressed`)}
        elevated={true}
      />

      <View style={{ flex: 1 }}>
        <WatchlistTabs
          tabs={getDefaultWatchlistTabs(itemCounts)}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variant="default"
        />

        {renderSearchBar()}
        {renderControls()}

        {isSelectionMode && (
          <SelectionToolbar
            selectedCount={selectedItems.length}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onBulkActions={() => console.log('Show bulk actions')}
          />
        )}

        {renderContent()}

        {isSelectionMode && selectedItems.length > 0 && (
          <BulkActions
            selectedItems={selectedItems}
            onAction={handleBulkAction}
            onClearSelection={handleClearSelection}
            availableLists={['watchlist', 'favorites', 'watched']}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};