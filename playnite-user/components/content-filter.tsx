import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton, TextButton } from '../../shared/components/button';

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

interface ContentFilterProps {
  filters: FilterState;
  availableCategories: string[];
  availableGenres: string[];
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClose: () => void;
}

interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
}

export const ContentFilter: React.FC<ContentFilterProps> = ({
  filters,
  availableCategories,
  availableGenres,
  onFiltersChange,
  onClose,
}) => {
  const { colors } = useTheme();
  const { width, height } = Dimensions.get('window');
  const isTablet = width >= 768;

  const [localFilters, setLocalFilters] = React.useState<FilterState>(filters);
  const [showSavedFilters, setShowSavedFilters] = React.useState(false);
  const [savedFilters, setSavedFilters] = React.useState<SavedFilter[]>([
    {
      id: '1',
      name: 'My Favorites',
      filters: {
        categories: ['Movies', 'TV Shows'],
        genres: ['Action', 'Comedy'],
        rating: { min: 4, max: 5 },
        duration: { min: 60, max: 120 },
        releaseYear: { min: 2020, max: 2024 },
        contentType: ['premium'],
        sortBy: 'rating',
        sortOrder: 'desc',
      },
    },
    {
      id: '2',
      name: 'Quick Watch',
      filters: {
        categories: ['Movies'],
        genres: ['Comedy', 'Animation'],
        rating: { min: 3, max: 5 },
        duration: { min: 0, max: 30 },
        releaseYear: { min: 2020, max: 2024 },
        contentType: [],
        sortBy: 'duration',
        sortOrder: 'asc',
      },
    },
  ]);

  // Update local filters when props change
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryToggle = (category: string) => {
    const newCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];

    setLocalFilters(prev => ({ ...prev, categories: newCategories }));
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = localFilters.genres.includes(genre)
      ? localFilters.genres.filter(g => g !== genre)
      : [...localFilters.genres, genre];

    setLocalFilters(prev => ({ ...prev, genres: newGenres }));
  };

  const handleRatingChange = (min: number, max: number) => {
    setLocalFilters(prev => ({
      ...prev,
      rating: { min: Math.min(min, max), max: Math.max(min, max) }
    }));
  };

  const handleDurationChange = (min: number, max: number) => {
    setLocalFilters(prev => ({
      ...prev,
      duration: { min: Math.min(min, max), max: Math.max(min, max) }
    }));
  };

  const handleYearChange = (min: number, max: number) => {
    setLocalFilters(prev => ({
      ...prev,
      releaseYear: { min: Math.min(min, max), max: Math.max(min, max) }
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      categories: [],
      genres: [],
      rating: { min: 0, max: 5 },
      duration: { min: 0, max: 120 },
      releaseYear: { min: 2000, max: new Date().getFullYear() },
      contentType: [],
      sortBy: 'popularity',
      sortOrder: 'desc',
    };
    setLocalFilters(resetFilters);
  };

  const handleSaveFilter = () => {
    // In a real app, this would show a dialog to enter filter name
    const filterName = `Filter ${savedFilters.length + 1}`;
    const newSavedFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: { ...localFilters },
    };
    setSavedFilters(prev => [...prev, newSavedFilter]);
  };

  const handleLoadSavedFilter = (savedFilter: SavedFilter) => {
    setLocalFilters(savedFilter.filters);
    setShowSavedFilters(false);
  };

  const handleDeleteSavedFilter = (filterId: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const RangeSlider: React.FC<{
    title: string;
    min: number;
    max: number;
    step: number;
    value: { min: number; max: number };
    onChange: (min: number, max: number) => void;
    formatValue?: (value: number) => string;
  }> = ({ title, min, max, step, value, onChange, formatValue }) => (
    <View style={{ marginBottom: 24 }}>
      <Typography variant="titleMedium" color="onSurface" style={{ marginBottom: 16 }}>
        {title}
      </Typography>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Typography variant="bodyMedium" color="onSurfaceVariant">
          {formatValue ? formatValue(value.min) : value.min}
        </Typography>
        <Typography variant="bodyMedium" color="onSurfaceVariant">
          {formatValue ? formatValue(value.max) : value.max}
        </Typography>
      </View>

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Typography variant="labelSmall" color="onSurfaceVariant" style={{ marginBottom: 8 }}>
            Min
          </Typography>
          <TouchableOpacity
            onPress={() => {
              const newMin = Math.max(min, value.min - step);
              onChange(newMin, value.max);
            }}
            style={{
              padding: 12,
              backgroundColor: colors.surfaceVariant,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {formatValue ? formatValue(value.min) : value.min}
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          <Typography variant="labelSmall" color="onSurfaceVariant" style={{ marginBottom: 8 }}>
            Max
          </Typography>
          <TouchableOpacity
            onPress={() => {
              const newMax = Math.min(max, value.max + step);
              onChange(value.min, newMax);
            }}
            style={{
              padding: 12,
              backgroundColor: colors.surfaceVariant,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {formatValue ? formatValue(value.max) : value.max}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const FilterSection: React.FC<{
    title: string;
    items: string[];
    selectedItems: string[];
    onToggle: (item: string) => void;
    maxVisible?: number;
  }> = ({ title, items, selectedItems, onToggle, maxVisible = 6 }) => {
    const [showAll, setShowAll] = React.useState(false);
    const visibleItems = showAll ? items : items.slice(0, maxVisible);

    return (
      <View style={{ marginBottom: 24 }}>
        <Typography variant="titleMedium" color="onSurface" style={{ marginBottom: 16 }}>
          {title}
        </Typography>

        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          {visibleItems.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => onToggle(item)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: selectedItems.includes(item)
                  ? colors.primary + '20'
                  : colors.surfaceVariant,
                borderWidth: selectedItems.includes(item) ? 1 : 0,
                borderColor: selectedItems.includes(item) ? colors.primary : 'transparent',
              }}
            >
              <Typography
                variant="labelLarge"
                color={selectedItems.includes(item) ? 'primary' : 'onSurfaceVariant'}
              >
                {item}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {items.length > maxVisible && (
          <TouchableOpacity
            onPress={() => setShowAll(!showAll)}
            style={{ alignSelf: 'flex-start', marginTop: 8 }}
          >
            <Typography variant="labelLarge" color="primary">
              {showAll ? 'Show Less' : `Show ${items.length - maxVisible} More`}
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const SavedFiltersModal = () => (
    <Modal
      visible={showSavedFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowSavedFilters(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}>
          <Typography variant="headlineSmall" color="onSurface">
            Saved Filters
          </Typography>
          <TouchableOpacity onPress={() => setShowSavedFilters(false)}>
            <Icon name="close" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          {savedFilters.map((savedFilter) => (
            <ElevatedCard key={savedFilter.id} style={{ marginBottom: 12, padding: 16 }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <View style={{ flex: 1 }}>
                  <Typography variant="titleMedium" color="onSurface">
                    {savedFilter.name}
                  </Typography>
                  <Typography variant="bodySmall" color="onSurfaceVariant">
                    {savedFilter.filters.categories.length} categories, {savedFilter.filters.genres.length} genres
                  </Typography>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleLoadSavedFilter(savedFilter)}
                    style={{
                      padding: 8,
                      backgroundColor: colors.primary,
                      borderRadius: 8,
                    }}
                  >
                    <Icon name="download" size={20} color={colors.onPrimary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteSavedFilter(savedFilter.id)}
                    style={{
                      padding: 8,
                      backgroundColor: colors.error,
                      borderRadius: 8,
                    }}
                  >
                    <Icon name="delete" size={20} color={colors.onError} />
                  </TouchableOpacity>
                </View>
              </View>
            </ElevatedCard>
          ))}

          {savedFilters.length === 0 && (
            <View style={{
              alignItems: 'center',
              paddingVertical: 64,
            }}>
              <Icon name="bookmark_border" size={64} color={colors.onSurfaceVariant} />
              <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ marginTop: 16 }}>
                No saved filters yet
              </Typography>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <>
      <Modal
        visible={true}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingTop: Platform.OS === 'ios' ? 50 : 20,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}>
            <Typography variant="headlineSmall" color="onSurface">
              Filters
            </Typography>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => setShowSavedFilters(true)}>
                <Icon name="bookmark" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={24} color={colors.onSurface} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Categories */}
            <FilterSection
              title="Categories"
              items={availableCategories}
              selectedItems={localFilters.categories}
              onToggle={handleCategoryToggle}
            />

            {/* Genres */}
            <FilterSection
              title="Genres"
              items={availableGenres}
              selectedItems={localFilters.genres}
              onToggle={handleGenreToggle}
            />

            {/* Rating Range */}
            <RangeSlider
              title="Rating"
              min={0}
              max={5}
              step={0.5}
              value={localFilters.rating}
              onChange={handleRatingChange}
              formatValue={(value) => `${value}★`}
            />

            {/* Duration Range */}
            <RangeSlider
              title="Duration (minutes)"
              min={0}
              max={180}
              step={15}
              value={localFilters.duration}
              onChange={handleDurationChange}
              formatValue={(value) => `${value}m`}
            />

            {/* Release Year Range */}
            <RangeSlider
              title="Release Year"
              min={2000}
              max={new Date().getFullYear()}
              step={1}
              value={localFilters.releaseYear}
              onChange={handleYearChange}
            />

            {/* Content Type */}
            <View style={{ marginBottom: 24 }}>
              <Typography variant="titleMedium" color="onSurface" style={{ marginBottom: 16 }}>
                Content Type
              </Typography>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['Free', 'Premium', 'New Releases'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      const newContentType = localFilters.contentType.includes(type)
                        ? localFilters.contentType.filter(t => t !== type)
                        : [...localFilters.contentType, type];
                      setLocalFilters(prev => ({ ...prev, contentType: newContentType }));
                    }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: localFilters.contentType.includes(type)
                        ? colors.primary + '20'
                        : colors.surfaceVariant,
                      borderWidth: localFilters.contentType.includes(type) ? 1 : 0,
                      borderColor: localFilters.contentType.includes(type) ? colors.primary : 'transparent',
                    }}
                  >
                    <Typography
                      variant="labelLarge"
                      color={localFilters.contentType.includes(type) ? 'primary' : 'onSurfaceVariant'}
                    >
                      {type}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={{
            flexDirection: 'row',
            gap: 12,
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
          }}>
            <View style={{ flex: 1 }}>
              <SecondaryButton onPress={handleResetFilters} fullWidth>
                Reset
              </SecondaryButton>
            </View>

            <View style={{ flex: 1 }}>
              <PrimaryButton onPress={handleApplyFilters} fullWidth>
                Apply Filters
              </PrimaryButton>
            </View>

            <SecondaryButton
              onPress={handleSaveFilter}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Icon name="bookmark" size={20} color={colors.primary} />
            </SecondaryButton>
          </View>
        </View>
      </Modal>

      <SavedFiltersModal />
    </>
  );
};