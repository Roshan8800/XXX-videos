import React from 'react';
import { View, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Icon } from '../../shared/utils/icons';
import { Surface, PrimaryButton, SecondaryButton } from '../../shared/components';
import { WatchlistItem, BulkAction, WatchlistType } from '../types/watchlist';

interface BulkActionsProps {
  selectedItems: WatchlistItem[];
  onAction: (action: BulkAction) => void;
  onClearSelection: () => void;
  availableLists?: WatchlistType[];
  style?: ViewStyle;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedItems,
  onAction,
  onClearSelection,
  availableLists = ['watchlist', 'favorites', 'watched'],
  style,
}) => {
  const { colors } = useTheme();

  const getBulkActionOptions = (): Array<{
    id: string;
    label: string;
    icon: string;
    color: string;
    variant: 'primary' | 'secondary' | 'danger';
    requiresList?: boolean;
  }> => [
    {
      id: 'remove',
      label: 'Remove from List',
      icon: 'delete',
      color: colors.error,
      variant: 'danger',
    },
    {
      id: 'move',
      label: 'Move to List',
      icon: 'arrow_forward',
      color: colors.primary,
      variant: 'primary',
      requiresList: true,
    },
    {
      id: 'download',
      label: 'Download All',
      icon: 'download',
      color: colors.primary,
      variant: 'primary',
    },
    {
      id: 'mark_watched',
      label: 'Mark as Watched',
      icon: 'visibility',
      color: colors.primary,
      variant: 'secondary',
    },
    {
      id: 'mark_favorite',
      label: 'Add to Favorites',
      icon: 'favorite',
      color: colors.primary,
      variant: 'secondary',
    },
    {
      id: 'set_priority',
      label: 'Set Priority',
      icon: 'priority_high',
      color: colors.primary,
      variant: 'secondary',
    },
    {
      id: 'add_tag',
      label: 'Add Tag',
      icon: 'tag',
      color: colors.primary,
      variant: 'secondary',
    },
  ];

  const handleBulkAction = (actionType: string, extraData?: any) => {
    const bulkAction: BulkAction = {
      type: actionType as any,
      itemIds: selectedItems.map(item => item.id),
      ...extraData,
    };

    onAction(bulkAction);
  };

  const handleMoveToList = (listType: WatchlistType) => {
    handleBulkAction('move', { targetList: listType });
  };

  const handleSetPriority = (priority: 'low' | 'medium' | 'high') => {
    handleBulkAction('set_priority', { priority });
  };

  const handleAddTag = (tag: string) => {
    handleBulkAction('add_tag', { tag });
  };

  const renderActionButtons = () => (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      {getBulkActionOptions().map((action) => (
        <TouchableOpacity
          key={action.id}
          style={{
            backgroundColor: action.variant === 'danger' ? colors.errorContainer : colors.surfaceVariant,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: action.variant === 'danger' ? colors.error : colors.outline,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
          onPress={() => {
            if (action.requiresList) {
              // Show list selection
              return;
            }
            handleBulkAction(action.id);
          }}
        >
          <Icon
            name={action.icon as any}
            size={16}
            color={action.variant === 'danger' ? colors.onErrorContainer : colors.onSurfaceVariant}
          />
          <Typography
            variant="labelMedium"
            color={action.variant === 'danger' ? 'onErrorContainer' : 'onSurfaceVariant'}
          >
            {action.label}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderListSelection = () => (
    <View style={{ gap: 8 }}>
      <Typography variant="titleMedium" color="onSurface">
        Move to List
      </Typography>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {availableLists.map((listType) => (
          <TouchableOpacity
            key={listType}
            style={{
              backgroundColor: colors.primaryContainer,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              gap: 8,
            }}
            onPress={() => handleMoveToList(listType)}
          >
            <Typography variant="labelLarge" color="onPrimaryContainer">
              {listType.charAt(0).toUpperCase() + listType.slice(1)}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPrioritySelection = () => (
    <View style={{ gap: 8 }}>
      <Typography variant="titleMedium" color="onSurface">
        Set Priority
      </Typography>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['low', 'medium', 'high'] as const).map((priority) => (
          <TouchableOpacity
            key={priority}
            style={{
              backgroundColor: colors.surfaceVariant,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              gap: 8,
              borderWidth: 1,
              borderColor: colors.outline,
            }}
            onPress={() => handleSetPriority(priority)}
          >
            <Typography variant="labelLarge" color="onSurfaceVariant">
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTagInput = () => (
    <View style={{ gap: 8 }}>
      <Typography variant="titleMedium" color="onSurface">
        Add Tag
      </Typography>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colors.outline,
          }}
        >
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            Enter tag name
          </Typography>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
          onPress={() => handleAddTag('New Tag')}
        >
          <Typography variant="labelLarge" color="onPrimary">
            Add
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Surface
      style={[
        {
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: colors.outlineVariant,
          backgroundColor: colors.surface,
        },
        style,
      ]}
    >
      {/* Selection header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="check_circle" size={20} color={colors.primary} />
          <Typography variant="titleMedium" color="onSurface">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </Typography>
        </View>
        <TouchableOpacity
          onPress={onClearSelection}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: colors.surfaceVariant,
          }}
        >
          <Icon name="close" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Quick actions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 16 }}
      >
        {renderActionButtons()}
      </ScrollView>

      {/* Action-specific options */}
      <View style={{ gap: 12 }}>
        {renderListSelection()}
        {renderPrioritySelection()}
        {renderTagInput()}
      </View>

      {/* Bottom actions */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
        <SecondaryButton
          onPress={onClearSelection}
          style={{ flex: 1 }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onPress={() => handleBulkAction('remove')}
          style={{ flex: 1 }}
        >
          Remove Selected
        </PrimaryButton>
      </View>
    </Surface>
  );
};

// Selection toolbar for individual items
export const SelectionToolbar: React.FC<{
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkActions: () => void;
  style?: ViewStyle;
}> = ({
  selectedCount,
  onSelectAll,
  onClearSelection,
  onBulkActions,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <Surface
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.outlineVariant,
          backgroundColor: colors.primaryContainer,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="check_circle" size={20} color={colors.onPrimaryContainer} />
        <Typography variant="titleMedium" color="onPrimaryContainer">
          {selectedCount} selected
        </Typography>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={onSelectAll}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: colors.surfaceVariant,
          }}
        >
          <Typography variant="labelMedium" color="onSurfaceVariant">
            Select All
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onBulkActions}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: colors.primary,
          }}
        >
          <Icon name="edit" size={20} color={colors.onPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onClearSelection}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: colors.errorContainer,
          }}
        >
          <Icon name="close" size={20} color={colors.onErrorContainer} />
        </TouchableOpacity>
      </View>
    </Surface>
  );
};

// Individual item selection checkbox
export const SelectionCheckbox: React.FC<{
  isSelected: boolean;
  onToggle: () => void;
  style?: ViewStyle;
}> = ({ isSelected, onToggle, style }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        {
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isSelected ? colors.primary : colors.outline,
          backgroundColor: isSelected ? colors.primary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {isSelected && (
        <Icon name="check_circle" size={14} color={colors.onPrimary} />
      )}
    </TouchableOpacity>
  );
};