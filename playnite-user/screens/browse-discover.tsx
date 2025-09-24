import React from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
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
import { ContentFilter } from '../components/content-filter';
import { ContentGrid } from '../components/content-grid';
import { FilterChips } from '../components/filter-chips';
import { SortPicker } from '../components/sort-picker';

interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  rating: number;
  category: string;
  genre: string[];
  releaseDate: string;
  viewCount: number;
  isPremium?: boolean;
  isNew?: boolean;
  description: string;
}

interface FilterState {
  categories: string[];
  genres: string[];
  rating: { min: number; max: number };
  duration: { min: number; max: number };
  releaseYear: { min: number; max: number };
  contentType: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const BrowseDiscoverScreen: React.FC = () => {
  const { colors } = useTheme();
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;

  // State management
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = React.useState(false);
  const [showSortOptions, setShowSortOptions] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  // Filter state
  const [filters, setFilters] = React.useState<FilterState>({
    categories: [],
    genres: [],
    rating: { min: 0, max: 5 },
    duration: { min: 0, max: 120 },
    releaseYear: { min: 2000, max: new Date().getFullYear() },
    contentType: [],
    sortBy: 'popularity',
    sortOrder: 'desc',
  });

  // Sample content data
  const [content, setContent] = React.useState<ContentItem[]>([
    {
      id: '1',
      title: 'Sample Movie 1',
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: 120,
      rating: 4.5,
      category: 'Movies',
      genre: ['Action', 'Thriller'],
      releaseDate: '2024-01-15',
      viewCount: 125000,
      isPremium: true,
      isNew: true,
      description: 'An exciting action thriller with stunning visuals',
    },
    {
      id: '2',
      title: 'TV Series Episode 1',
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: 45,
      rating: 4.2,
      category: 'TV Shows',
      genre: ['Drama', 'Mystery'],
      releaseDate: '2024-02-01',
      viewCount: 89000,
      description: 'A gripping drama series with unexpected twists',
    },
    {
      id: '3',
      title: 'Documentary Special',
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: 90,
      rating: 4.8,
      category: 'Documentaries',
      genre: ['Educational', 'Nature'],
      releaseDate: '2024-01-20',
      viewCount: 67000,
      isPremium: true,
      description: 'An informative documentary about wildlife conservation',
    },
  ]);

  const [filteredContent, setFilteredContent] = React.useState<ContentItem[]>(content);

  // Available filter options
  const availableCategories = ['Movies', 'TV Shows', 'Documentaries', 'Short Films', 'Series'];
  const availableGenres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Documentary', 'Animation'];
  const sortOptions = [
    { id: 'popularity', label: 'Most Popular', icon: 'trending_up' },
    { id: 'rating', label: 'Highest Rated', icon: 'star' },
    { id: 'newest', label: 'Recently Added', icon: 'new_releases' },
    { id: 'title', label: 'Alphabetical', icon: 'sort_by_alpha' },
    { id: 'duration', label: 'Duration', icon: 'schedule' },
  ];

  // Filter content based on current filters
  const applyFilters = React.useCallback(() => {
    let filtered = [...content];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.genre.some(g => g.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => filters.categories.includes(item.category));
    }

    // Genre filter
    if (filters.genres.length > 0) {
      filtered = filtered.filter(item =>
        item.genre.some(genre => filters.genres.includes(genre))
      );
    }

    // Rating filter
    filtered = filtered.filter(item =>
      item.rating >= filters.rating.min && item.rating <= filters.rating.max
    );

    // Duration filter
    filtered = filtered.filter(item =>
      item.duration >= filters.duration.min && item.duration <= filters.duration.max
    );

    // Release year filter
    const itemYear = new Date(filtered[0]?.releaseDate || '2024').getFullYear();
    filtered = filtered.filter(item => {
      const year = new Date(item.releaseDate).getFullYear();
      return year >= filters.releaseYear.min && year <= filters.releaseYear.max;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'popularity':
          comparison = b.viewCount - a.viewCount;
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          break;
        case 'newest':
          comparison = new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'duration':
          comparison = b.duration - a.duration;
          break;
        default:
          comparison = b.viewCount - a.viewCount;
      }

      return filters.sortOrder === 'desc' ? comparison : -comparison;
    });

    setFilteredContent(filtered);
  }, [content, searchQuery, filters]);

  // Apply filters when dependencies change
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Load more content
  const loadMoreContent = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newContent: ContentItem[] = [
        {
          id: `${content.length + 1}`,
          title: `Sample Content ${content.length + 1}`,
          thumbnail: 'https://via.placeholder.com/300x200',
          duration: Math.floor(Math.random() * 120) + 30,
          rating: Math.random() * 2 + 3,
          category: availableCategories[Math.floor(Math.random() * availableCategories.length)],
          genre: availableGenres.slice(0, Math.floor(Math.random() * 3) + 1),
          releaseDate: '2024-01-01',
          viewCount: Math.floor(Math.random() * 100000),
          description: 'Sample content description',
        },
      ];

      setContent(prev => [...prev, ...newContent]);
      setIsLoading(false);
      setHasMore(newContent.length > 0);
    }, 1000);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle content item press
  const handleContentPress = (item: ContentItem) => {
    console.log('Content pressed:', item.title);
    // Navigate to content details
  };

  // Handle quick actions
  const handleQuickAction = (action: string, item: ContentItem) => {
    switch (action) {
      case 'watchlist':
        console.log('Add to watchlist:', item.title);
        break;
      case 'share':
        console.log('Share:', item.title);
        break;
      case 'download':
        console.log('Download:', item.title);
        break;
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
          placeholder="Search movies, shows, documentaries..."
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

  // Render filter and sort controls
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
            name="grid_view"
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
            name="list"
            size={20}
            color={viewMode === 'list' ? colors.primary : colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render filter chips
  const renderFilterChips = () => (
    <FilterChips
      selectedCategories={filters.categories}
      selectedGenres={filters.genres}
      onCategoryToggle={(category) => handleFilterChange({
        categories: filters.categories.includes(category)
          ? filters.categories.filter(c => c !== category)
          : [...filters.categories, category]
      })}
      onGenreToggle={(genre) => handleFilterChange({
        genres: filters.genres.includes(genre)
          ? filters.genres.filter(g => g !== genre)
          : [...filters.genres, genre]
      })}
      onClearAll={() => handleFilterChange({
        categories: [],
        genres: []
      })}
    />
  );

  // Render sort picker
  const renderSortPicker = () => (
    <SortPicker
      sortBy={filters.sortBy}
      sortOrder={filters.sortOrder}
      options={sortOptions}
      onSortChange={(sortBy, sortOrder) => handleFilterChange({ sortBy, sortOrder })}
      onClose={() => setShowSortOptions(false)}
    />
  );

  // Render content grid/list
  const renderContent = () => (
    <ContentGrid
      content={filteredContent}
      viewMode={viewMode}
      isLoading={isLoading}
      onContentPress={handleContentPress}
      onQuickAction={handleQuickAction}
      onLoadMore={loadMoreContent}
      hasMore={hasMore}
    />
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 64,
    }}>
      <Icon name="search_off" size={64} color={colors.onSurfaceVariant} />
      <Typography variant="headlineSmall" color="onSurface" style={{ marginTop: 16, marginBottom: 8 }}>
        No content found
      </Typography>
      <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ textAlign: 'center', marginBottom: 24 }}>
        Try adjusting your filters or search terms to find more content.
      </Typography>
      <SecondaryButton onPress={() => handleFilterChange({
        categories: [],
        genres: [],
        rating: { min: 0, max: 5 },
        duration: { min: 0, max: 120 },
        releaseYear: { min: 2000, max: new Date().getFullYear() },
        contentType: [],
      })}>
        Clear All Filters
      </SecondaryButton>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AppBar
        title="Browse & Discover"
        leadingIcon="arrow_back"
        trailingIcons={['notifications', 'bookmark']}
        onLeadingIconPress={() => console.log('Back pressed')}
        onTrailingIconPress={(icon) => console.log(`${icon} pressed`)}
        elevated={true}
      />

      <View style={{ flex: 1 }}>
        {renderSearchBar()}
        {renderControls()}

        {showFilters && (
          <ContentFilter
            filters={filters}
            availableCategories={availableCategories}
            availableGenres={availableGenres}
            onFiltersChange={handleFilterChange}
            onClose={() => setShowFilters(false)}
          />
        )}

        {showSortOptions && renderSortPicker()}

        {renderFilterChips()}

        {filteredContent.length === 0 ? renderEmptyState() : renderContent()}
      </View>
    </KeyboardAvoidingView>
  );
};