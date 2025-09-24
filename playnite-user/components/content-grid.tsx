import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ClickableCard } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton } from '../../shared/components/button';

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

interface ContentGridProps {
  content: ContentItem[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  onContentPress: (item: ContentItem) => void;
  onQuickAction: (action: string, item: ContentItem) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  content,
  viewMode,
  isLoading,
  onContentPress,
  onQuickAction,
  onLoadMore,
  hasMore,
}) => {
  const { colors } = useTheme();
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;

  const [refreshing, setRefreshing] = React.useState(false);

  // Calculate responsive dimensions
  const getGridDimensions = () => {
    const screenWidth = width;
    const padding = 16;
    const gap = 12;

    if (viewMode === 'list') {
      return {
        numColumns: 1,
        itemWidth: screenWidth - (padding * 2),
        itemHeight: 120,
      };
    }

    // Grid mode
    let numColumns = 2;
    if (isTablet) {
      numColumns = width > 1024 ? 4 : 3;
    }

    const availableWidth = screenWidth - (padding * 2) - (gap * (numColumns - 1));
    const itemWidth = availableWidth / numColumns;
    const itemHeight = itemWidth * 0.75 + 80; // Aspect ratio + text height

    return {
      numColumns,
      itemWidth,
      itemHeight,
    };
  };

  const { numColumns, itemWidth, itemHeight } = getGridDimensions();

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Render loading skeleton
  const renderSkeletonItem = () => (
    <View style={{
      width: itemWidth,
      height: itemHeight,
      marginBottom: 16,
      padding: 8,
    }}>
      <Card style={{
        flex: 1,
        backgroundColor: colors.surfaceVariant,
      }}>
        <View style={{
          width: '100%',
          height: itemHeight * 0.6,
          backgroundColor: colors.surface,
          borderRadius: 8,
        }} />
        <View style={{ padding: 12 }}>
          <View style={{
            height: 16,
            backgroundColor: colors.surface,
            borderRadius: 4,
            marginBottom: 8,
          }} />
          <View style={{
            height: 12,
            backgroundColor: colors.surface,
            borderRadius: 4,
            width: '70%',
          }} />
        </View>
      </Card>
    </View>
  );

  // Render content item in grid mode
  const renderGridItem = ({ item }: { item: ContentItem }) => (
    <View style={{
      width: itemWidth,
      marginBottom: 16,
      paddingHorizontal: 4,
    }}>
      <ClickableCard
        style={{
          backgroundColor: colors.surface,
        }}
        onPress={() => onContentPress(item)}
      >
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: item.thumbnail }}
            style={{
              width: '100%',
              height: itemHeight * 0.6,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />

          {/* Premium/New badges */}
          <View style={{ position: 'absolute', top: 8, left: 8, flexDirection: 'row', gap: 4 }}>
            {item.isPremium && (
              <View style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 10,
              }}>
                <Typography variant="labelSmall" color="onPrimary">
                  Premium
                </Typography>
              </View>
            )}
            {item.isNew && (
              <View style={{
                backgroundColor: colors.error,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 10,
              }}>
                <Typography variant="labelSmall" color="onError">
                  New
                </Typography>
              </View>
            )}
          </View>

          {/* Duration */}
          <View style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}>
            <Typography variant="labelSmall" color="onPrimary">
              {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
            </Typography>
          </View>
        </View>

        <View style={{ padding: 12 }}>
          <Typography variant="titleMedium" color="onSurface" numberOfLines={1} style={{ marginBottom: 4 }}>
            {item.title}
          </Typography>

          <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={2} style={{ marginBottom: 8 }}>
            {item.description}
          </Typography>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="star" size={14} color={colors.primary} />
              <Typography variant="labelSmall" color="onSurfaceVariant">
                {item.rating.toFixed(1)}
              </Typography>
            </View>

            <Typography variant="labelSmall" color="onSurfaceVariant">
              {item.viewCount.toLocaleString()} views
            </Typography>
          </View>

          {/* Quick actions */}
          <View style={{
            flexDirection: 'row',
            gap: 8,
            marginTop: 8,
          }}>
            <TouchableOpacity
              onPress={() => onQuickAction('watchlist', item)}
              style={{
                flex: 1,
                paddingVertical: 6,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 6,
                alignItems: 'center',
              }}
            >
              <Icon name="bookmark_border" size={16} color={colors.onSurfaceVariant} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onQuickAction('share', item)}
              style={{
                flex: 1,
                paddingVertical: 6,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 6,
                alignItems: 'center',
              }}
            >
              <Icon name="share" size={16} color={colors.onSurfaceVariant} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onQuickAction('download', item)}
              style={{
                flex: 1,
                paddingVertical: 6,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 6,
                alignItems: 'center',
              }}
            >
              <Icon name="download" size={16} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>
      </ClickableCard>
    </View>
  );

  // Render content item in list mode
  const renderListItem = ({ item }: { item: ContentItem }) => (
    <ClickableCard
      style={{
        marginBottom: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
      }}
      onPress={() => onContentPress(item)}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={{
          width: 120,
          height: 80,
          borderRadius: 8,
        }}
        resizeMode="cover"
      />

      <View style={{ flex: 1, marginLeft: 16 }}>
        <Typography variant="titleMedium" color="onSurface" numberOfLines={1} style={{ marginBottom: 4 }}>
          {item.title}
        </Typography>

        <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={2} style={{ marginBottom: 8 }}>
          {item.description}
        </Typography>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="star" size={14} color={colors.primary} />
              <Typography variant="labelSmall" color="onSurfaceVariant">
                {item.rating.toFixed(1)}
              </Typography>
            </View>

            <Typography variant="labelSmall" color="onSurfaceVariant">
              {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
            </Typography>

            <Typography variant="labelSmall" color="onSurfaceVariant">
              {item.category}
            </Typography>
          </View>

          <Typography variant="labelSmall" color="onSurfaceVariant">
            {item.viewCount.toLocaleString()} views
          </Typography>
        </View>
      </View>

      {/* Quick actions */}
      <View style={{ flexDirection: 'row', gap: 8, marginLeft: 12 }}>
        <TouchableOpacity
          onPress={() => onQuickAction('watchlist', item)}
          style={{
            padding: 8,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 6,
          }}
        >
          <Icon name="bookmark_border" size={16} color={colors.onSurfaceVariant} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onQuickAction('share', item)}
          style={{
            padding: 8,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 6,
          }}
        >
          <Icon name="share" size={16} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
    </ClickableCard>
  );

  // Render loading footer
  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View style={{
        paddingVertical: 20,
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginTop: 8 }}>
          Loading more content...
        </Typography>
      </View>
    );
  };

  // Render load more button
  const renderLoadMoreButton = () => {
    if (!hasMore || isLoading) return null;

    return (
      <View style={{
        alignItems: 'center',
        paddingVertical: 20,
      }}>
        <SecondaryButton onPress={onLoadMore}>
          Load More Content
        </SecondaryButton>
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 64,
    }}>
      <Icon name="movie" size={64} color={colors.onSurfaceVariant} />
      <Typography variant="headlineSmall" color="onSurface" style={{ marginTop: 16, marginBottom: 8 }}>
        No content available
      </Typography>
      <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
        Check back later for new content or adjust your filters.
      </Typography>
    </View>
  );

  if (content.length === 0 && !isLoading) {
    return renderEmptyState();
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={content}
        renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? numColumns : 1}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={hasMore ? onLoadMore : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        key={viewMode} // Force re-render when view mode changes
      />

      {renderLoadMoreButton()}
    </View>
  );
};