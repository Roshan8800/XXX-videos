import React from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';
import { Card } from '../../shared/components';

interface SortOption {
  id: string;
  label: string;
  icon: string;
}

interface SortPickerProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  options: SortOption[];
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onClose: () => void;
}

export const SortPicker: React.FC<SortPickerProps> = ({
  sortBy,
  sortOrder,
  options,
  onSortChange,
  onClose,
}) => {
  const { colors } = useTheme();

  const handleSortSelect = (optionId: string) => {
    // If same option selected, toggle order
    if (optionId === sortBy) {
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      onSortChange(optionId, newOrder);
    } else {
      // Default to descending for new selection
      onSortChange(optionId, 'desc');
    }
    onClose();
  };

  const renderSortOption = ({ item }: { item: SortOption }) => {
    const isSelected = item.id === sortBy;

    return (
      <TouchableOpacity
        onPress={() => handleSortSelect(item.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: isSelected ? colors.primary + '10' : 'transparent',
          borderLeftWidth: isSelected ? 4 : 0,
          borderLeftColor: isSelected ? colors.primary : 'transparent',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon
            name={item.icon as any}
            size={20}
            color={isSelected ? colors.primary : colors.onSurfaceVariant}
          />
          <Typography
            variant="bodyLarge"
            color={isSelected ? 'primary' : 'onSurface'}
          >
            {item.label}
          </Typography>
        </View>

        {isSelected && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Typography variant="labelSmall" color="primary">
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </Typography>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => (
    <View style={{
      height: 1,
      backgroundColor: colors.outlineVariant,
      marginHorizontal: 20,
    }} />
  );

  return (
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
            Sort Options
          </Typography>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Sort Options List */}
        <FlatList
          data={options}
          renderItem={renderSortOption}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        {/* Quick Sort Actions */}
        <View style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.outlineVariant,
        }}>
          <Typography variant="titleSmall" color="onSurface" style={{ marginBottom: 12 }}>
            Quick Sort
          </Typography>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => handleSortSelect('popularity')}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: sortBy === 'popularity' ? colors.primary + '20' : colors.surfaceVariant,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: sortBy === 'popularity' ? 1 : 0,
                borderColor: sortBy === 'popularity' ? colors.primary : 'transparent',
              }}
            >
              <Icon
                name="trending_up"
                size={20}
                color={sortBy === 'popularity' ? colors.primary : colors.onSurfaceVariant}
              />
              <Typography
                variant="labelMedium"
                color={sortBy === 'popularity' ? 'primary' : 'onSurfaceVariant'}
                style={{ marginTop: 4 }}
              >
                Popular
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSortSelect('rating')}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: sortBy === 'rating' ? colors.primary + '20' : colors.surfaceVariant,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: sortBy === 'rating' ? 1 : 0,
                borderColor: sortBy === 'rating' ? colors.primary : 'transparent',
              }}
            >
              <Icon
                name="star"
                size={20}
                color={sortBy === 'rating' ? colors.primary : colors.onSurfaceVariant}
              />
              <Typography
                variant="labelMedium"
                color={sortBy === 'rating' ? 'primary' : 'onSurfaceVariant'}
                style={{ marginTop: 4 }}
              >
                Top Rated
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSortSelect('newest')}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: sortBy === 'newest' ? colors.primary + '20' : colors.surfaceVariant,
                borderRadius: 12,
                alignItems: 'center',
                borderWidth: sortBy === 'newest' ? 1 : 0,
                borderColor: sortBy === 'newest' ? colors.primary : 'transparent',
              }}
            >
              <Icon
                name="star"
                size={20}
                color={sortBy === 'newest' ? colors.primary : colors.onSurfaceVariant}
              />
              <Typography
                variant="labelMedium"
                color={sortBy === 'newest' ? 'primary' : 'onSurfaceVariant'}
                style={{ marginTop: 4 }}
              >
                Latest
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};