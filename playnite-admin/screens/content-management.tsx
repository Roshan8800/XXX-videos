import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, ClickableCard } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { FirestoreUtils, FirebaseHelpers } from '../../shared/utils/firebase-utils';

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'image' | 'audio';
  status: 'published' | 'draft' | 'pending' | 'rejected';
  uploadDate: string;
  views: number;
  author: string;
  thumbnail: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

export const ContentManagement: React.FC = () => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'published' | 'draft' | 'pending'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({ total: 0, published: 0, pending: 0, draft: 0 });


  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'published': return colors.primary;
      case 'pending': return colors.tertiary;
      case 'draft': return colors.outline;
      case 'rejected': return colors.error;
      default: return colors.onSurfaceVariant;
    }
  };

  const getStatusIcon = (status: ContentItem['status']) => {
    switch (status) {
      case 'published': return 'check_circle';
      case 'pending': return 'schedule';
      case 'draft': return 'edit';
      case 'rejected': return 'error';
      default: return 'help';
    }
  };

  const loadContentData = async () => {
    try {
      // Load all videos for content management
      const videos = await FirestoreUtils.queryDocuments('videos', [
        FirebaseHelpers.where('isActive', '==', true)
      ]);

      // Transform videos to ContentItem format
      const transformedContent: ContentItem[] = videos.map((video: any) => ({
        id: video.id,
        title: video.title,
        type: 'video',
        status: video.status || 'published',
        uploadDate: new Date(video.createdAt?.toDate()).toISOString().split('T')[0],
        views: parseInt(video.views) || 0,
        author: video.studio || 'Unknown',
        thumbnail: video.thumbnail
      }));

      // Load categories from videos
      const categoryMap = new Map();
      videos.forEach((video: any) => {
        const category = video.category;
        if (category) {
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        }
      });

      const transformedCategories: Category[] = [
        { id: 'all', name: 'All Content', count: videos.length, color: colors.primary },
        ...Array.from(categoryMap.entries()).map(([name, count]) => ({
          id: name.toLowerCase(),
          name,
          count,
          color: colors.secondary
        }))
      ];

      // Calculate stats
      const stats = {
        total: videos.length,
        published: videos.filter((v: any) => v.status === 'published').length,
        pending: videos.filter((v: any) => v.status === 'pending').length,
        draft: videos.filter((v: any) => v.status === 'draft').length
      };

      setContentItems(transformedContent);
      setCategories(transformedCategories);
      setStats(stats);
    } catch (error) {
      console.error('Error loading content data:', error);
    }
  };

  React.useEffect(() => {
    loadContentData();
  }, []);

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const StatCard: React.FC<{ title: string; value: string; icon: string; color?: string }> = ({
    title, value, icon, color
  }) => (
    <ElevatedCard style={{ flex: 1, marginHorizontal: 4, padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color || colors.primaryContainer,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
          <Icon
            name={icon as any}
            size={20}
            color={color ? colors.onPrimary : colors.onPrimaryContainer}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Typography variant="titleMedium" color="onSurface">
            {title}
          </Typography>
          <Typography variant="displaySmall" color="onSurface">
            {value}
          </Typography>
        </View>
      </View>
    </ElevatedCard>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <Typography variant="headlineMedium" color="onBackground">
          Content Management
        </Typography>
        <Typography variant="bodyLarge" color="onSurfaceVariant">
          Manage videos, images, and other content across the platform
        </Typography>
      </View>

      {/* Stats Overview */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
      }}>
        <StatCard
          title="Total Content"
          value={stats.total.toString()}
          icon="video_library"
        />
        <StatCard
          title="Published"
          value={stats.published.toString()}
          icon="check_circle"
          color={colors.primary}
        />
        <StatCard
          title="Pending Review"
          value={stats.pending.toString()}
          icon="schedule"
          color={colors.tertiary}
        />
        <StatCard
          title="Draft"
          value={stats.draft.toString()}
          icon="edit"
          color={colors.outline}
        />
      </View>

      {/* Search and Filters */}
      <ElevatedCard style={{ marginBottom: 24, padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Icon name="search" size={20} color={colors.onSurfaceVariant} />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: colors.onSurface,
            }}
            placeholder="Search content..."
            placeholderTextColor={colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Buttons */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {(['all', 'published', 'pending', 'draft'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: selectedFilter === filter ? colors.primaryContainer : colors.surfaceVariant,
              }}
              onPress={() => setSelectedFilter(filter)}
            >
              <Typography
                variant="labelMedium"
                color={selectedFilter === filter ? 'onPrimaryContainer' : 'onSurfaceVariant'}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </ElevatedCard>

      {/* Categories */}
      <ElevatedCard style={{ marginBottom: 24, padding: 16 }}>
        <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16 }}>
          Categories
        </Typography>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 16,
                backgroundColor: selectedCategory === category.id ? category.color + '20' : colors.surfaceVariant,
                borderWidth: selectedCategory === category.id ? 1 : 0,
                borderColor: category.color,
              }}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Typography
                variant="labelMedium"
                color={selectedCategory === category.id ? category.color : 'onSurfaceVariant'}
              >
                {category.name} ({category.count})
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </ElevatedCard>

      {/* Content List */}
      <ElevatedCard style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Typography variant="titleLarge" color="onSurface">
            Content Library
          </Typography>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: colors.primary,
              borderRadius: 8,
            }}
            onPress={() => Alert.alert('Upload Content', 'Content upload feature coming soon!')}
          >
            <Icon name="add" size={20} color={colors.onPrimary} />
            <Typography variant="labelMedium" color="onPrimary" style={{ marginLeft: 8 }}>
              Upload
            </Typography>
          </TouchableOpacity>
        </View>

        {filteredContent.map((item) => (
          <ClickableCard
            key={item.id}
            style={{
              padding: 16,
              marginBottom: 12,
              borderLeftWidth: 4,
              borderLeftColor: getStatusColor(item.status),
            }}
            onPress={() => Alert.alert('Content Details', `Viewing: ${item.title}`)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                backgroundColor: colors.surfaceVariant,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Icon
                  name={item.type === 'video' ? 'video_library' : 'image'}
                  size={24}
                  color={colors.onSurfaceVariant}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Typography variant="titleMedium" color="onSurface">
                  {item.title}
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  by {item.author} • {item.views.toLocaleString()} views
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  Uploaded {item.uploadDate}
                </Typography>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={getStatusIcon(item.status) as any}
                  size={20}
                  color={getStatusColor(item.status)}
                />
                <Typography
                  variant="bodySmall"
                  color={getStatusColor(item.status)}
                  style={{ marginLeft: 4 }}
                >
                  {item.status}
                </Typography>
              </View>
            </View>
          </ClickableCard>
        ))}
      </ElevatedCard>
    </ScrollView>
  );
};