import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';

interface FilterChipsProps {
  selectedCategories: string[];
  selectedGenres: string[];
  onCategoryToggle: (category: string) => void;
  onGenreToggle: (genre: string) => void;
  onClearAll: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedCategories,
  selectedGenres,
  onCategoryToggle,
  onGenreToggle,
  onClearAll,
}) => {
  const { colors } = useTheme();

  const allSelectedFilters = [
    ...selectedCategories.map(cat => ({ type: 'category' as const, value: cat })),
    ...selectedGenres.map(genre => ({ type: 'genre' as const, value: genre })),
  ];

  const hasActiveFilters = allSelectedFilters.length > 0;

  // Render filter chip
  const renderFilterChip = (filter: { type: 'category' | 'genre'; value: string }) => (
    <TouchableOpacity
      key={`${filter.type}-${filter.value}`}
      onPress={() => {
        if (filter.type === 'category') {
          onCategoryToggle(filter.value);
        } else {
          onGenreToggle(filter.value);
        }
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.primary + '20',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.primary,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Typography variant="labelMedium" color="primary">
        {filter.value}
      </Typography>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          if (filter.type === 'category') {
            onCategoryToggle(filter.value);
          } else {
            onGenreToggle(filter.value);
          }
        }}
        style={{
          padding: 2,
          borderRadius: 8,
        }}
      >
        <Icon name="close" size={14} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render category suggestion chip
  const renderCategorySuggestion = (category: string) => (
    <TouchableOpacity
      key={`category-${category}`}
      onPress={() => onCategoryToggle(category)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.surfaceVariant,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Icon name="category" size={14} color={colors.onSurfaceVariant} />
      <Typography variant="labelMedium" color="onSurfaceVariant">
        {category}
      </Typography>
    </TouchableOpacity>
  );

  // Render genre suggestion chip
  const renderGenreSuggestion = (genre: string) => (
    <TouchableOpacity
      key={`genre-${genre}`}
      onPress={() => onGenreToggle(genre)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.surfaceVariant,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Icon name="movie" size={14} color={colors.onSurfaceVariant} />
      <Typography variant="labelMedium" color="onSurfaceVariant">
        {genre}
      </Typography>
    </TouchableOpacity>
  );

  // Popular categories for suggestions
  const popularCategories = [
    'Movies',
    'TV Shows',
    'Documentaries',
    'Animation',
    'Comedy',
  ];

  // Popular genres for suggestions
  const popularGenres = [
    'Action',
    'Drama',
    'Comedy',
    'Thriller',
    'Romance',
    'Horror',
    'Sci-Fi',
    'Documentary',
  ];

  const availableCategories = popularCategories.filter(
    cat => !selectedCategories.includes(cat)
  );

  const availableGenres = popularGenres.filter(
    genre => !selectedGenres.includes(genre)
  );

  if (!hasActiveFilters && availableCategories.length === 0 && availableGenres.length === 0) {
    return null;
  }

  return (
    <View style={{
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
    }}>
      {/* Active Filters */}
      {hasActiveFilters && (
        <View style={{ marginBottom: 16 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Typography variant="titleSmall" color="onSurface">
              Active Filters
            </Typography>

            <TouchableOpacity
              onPress={onClearAll}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
                backgroundColor: colors.error + '20',
                borderRadius: 12,
              }}
            >
              <Typography variant="labelSmall" color="error">
                Clear All
              </Typography>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {allSelectedFilters.map(renderFilterChip)}
          </ScrollView>
        </View>
      )}

      {/* Filter Suggestions */}
      {(availableCategories.length > 0 || availableGenres.length > 0) && (
        <View>
          <Typography variant="titleSmall" color="onSurface" style={{ marginBottom: 12 }}>
            Quick Filters
          </Typography>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {/* Category suggestions */}
            {availableCategories.slice(0, 3).map(renderCategorySuggestion)}

            {/* Genre suggestions */}
            {availableGenres.slice(0, 4).map(renderGenreSuggestion)}
          </ScrollView>
        </View>
      )}

      {/* Show more options if there are more available filters */}
      {(availableCategories.length > 3 || availableGenres.length > 4) && (
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
              backgroundColor: colors.surfaceVariant,
              borderRadius: 12,
            }}
          >
            <Typography variant="labelLarge" color="primary">
              +{Math.max(0, availableCategories.length - 3 + availableGenres.length - 4)} More Filters
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};