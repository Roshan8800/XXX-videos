import React from 'react';
import { ScrollView, View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, ClickableCard, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton, TextButton } from '../../shared/components/button';

interface Category {
  id: string;
  name: string;
  thumbnail: string;
  videoCount: number;
  description: string;
  isPopular?: boolean;
  subcategories?: string[];
}

interface FilterOption {
  id: string;
  label: string;
  icon: string;
}

export const CategoriesScreen: React.FC = () => {
  const { colors } = useTheme();

  const [selectedFilter, setSelectedFilter] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<string>('popular');
  const [showFilters, setShowFilters] = React.useState(false);

  const filters: FilterOption[] = [
    { id: 'all', label: 'All Categories', icon: 'category' },
    { id: 'popular', label: 'Most Popular', icon: 'trending_up' },
    { id: 'new', label: 'Recently Added', icon: 'new_releases' },
    { id: 'premium', label: 'Premium Only', icon: 'star' },
  ];

  const sortOptions = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'alphabetical', label: 'A-Z' },
    { id: 'newest', label: 'Newest First' },
    { id: 'video_count', label: 'Most Content' },
  ];

  const categories: Category[] = [
    {
      id: 'amateur',
      name: 'Amateur',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcq5TyCvjyD_w6OMo5nsnlGVfz_Ut84fGjoG44pI1u1H-EBdP_kbpzqhn8X0dntnZIGiip2xInD8BwlaJ_tWOMMCbL7yOiv0nGHUKR3pphPSHQ1CRtj8i6E_PFmU3ZyrpTqb_nz1syNf4BLXAl4cYBtd7u-Ju7j5ofD3_YV4qOvOrAhxthp3y_oz1PvHDbti-kaJ6B0GT0B_6EgXrba7m1XE4TTsPFda2O_wD0vP-89umbof7aZitzBEOq4P5hDXukTUNpGIj60Nk',
      videoCount: 15420,
      description: 'Real amateur content from everyday people',
      isPopular: true,
      subcategories: ['Homemade', 'Real Couples', 'First Time', 'Hidden Cam'],
    },
    {
      id: 'anal',
      name: 'Anal',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ1DalAdTuND3-5YXw0AxnIpNQmifF7FVhhQxHnFW6gezOczdo4kmxaiaalWx28NIa0GkZjq-eNfGmA0ICdibo951m-t631JFt6exnD4QvVs34dLZw1KYZ28XvvDaUGfk2ZRsp9-F-tMyuqwVQHyOJ2ziOFlf4uGi8vnxbK5EzIXXOqPRd5YuSoRF7LS1AmgovKfoqRz681T1RIwHXR_fZhtQkIjnB0oOVuVnxpXSIUOrJmzR0rsbsFO1DV1dnZoOxCb-8c8OcsaM',
      videoCount: 8930,
      description: 'Anal sex and ass play content',
      isPopular: true,
      subcategories: ['First Anal', 'Double Penetration', 'Anal Training', 'Gape'],
    },
    {
      id: 'asian',
      name: 'Asian',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_SWvGj1ngsAbVs4Y7Cyeawo0Y5yUQRbGHgGbZahG4fDXwa4YTrk729edXq52gcuDupEn11fPAz4ihZVFn9QYFS06TL9_0K-2Nzg0w-BAC1ZgBy2KDFDxlV_JJ0PUOmOzzFwq9IcX2WtcSh00Z3y5HrtFWD1Ad7llT8FbEhBNmGOnImaMKN0FO48hSdC3ioU7NCBnyv69Ri1Z6d5fwUNt0Ky_3k8_ObdXp0lol07a1ErOJElMk6FMoT5VVNVdSiDFenfcZQakl-WI',
      videoCount: 12450,
      description: 'Asian adult content featuring various Asian performers',
      isPopular: true,
      subcategories: ['Japanese', 'Korean', 'Thai', 'Chinese'],
    },
    {
      id: 'bdsm',
      name: 'BDSM',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcQteBLIHG4jw1g1XV0NPu1bhGfBnVxDuYlRg5Nsup2eToe9cGbb3HeO9l7EmGdH-Q-rEz7AaEb05M5ZmoZhknRDoY5lpzp3xuGC9BCAWO0pPvjvnXhXSA9_gKT2mZyFL0gDkP1TtGYJ-gXFN0CE3wda3WwTpARVB3ey-qxBkMINuNSjU4XMccseBHsiIfQMwCesPJhgl5kjrJFGcDRH0hkBI2joc6I1-FhvZkYLTUuWDpzJKJeSeFLvowNy--hytAy3UJLKZuJZk',
      videoCount: 5670,
      description: 'Bondage, discipline, dominance, submission, and masochism',
      subcategories: ['Bondage', 'Domination', 'Submission', 'Roleplay'],
    },
    {
      id: 'big-dick',
      name: 'Big Dick',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJE9yJm2MMxgvrbwgyscIdQX39ghiDrIgjmywhjdmyMmndWEG7vHospXTFpF9c8SyzeDe3xfDJ2Njd0O3A9yiIYmTtD8SmfcIRte7dsKv7QHtR-CGWaLuFMOAwXTuC-Ubi6tB0VY0vPxMtyLO-F6NnafeR2pfviVtE8TR--t2O_KA9pxZhdZh3f-NVWETdoc0z9lT01Uyz2aYyXHu5-rqiU2f6IdvsINQU5bI8mvSWsU7LTn9OFJQbYFSo17FoIATEwThwFLSbERc',
      videoCount: 7230,
      description: 'Content featuring well-endowed male performers',
      subcategories: ['Monster Cock', 'Size Queen', 'Deep Throat', 'Gagging'],
    },
    {
      id: 'blonde',
      name: 'Blonde',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7IStrag5r80jv25qb5-1gwRySqo7KoHtrKxhnLGquo0PeLasMn8Rbs49TUXc1yxWfYYsBw8kHWaym_TeV7cW-VUaVtkBou52XRpesqw79Uf4BcxQVV-Ha-R7GWSxqp9ihJbdAYLF4Kdg_0b1fPrxDkvF_et5xG1mUkRdW3d_Cd9x433q0RRfjnJWMKJzxIkXDINms3EKaPK7Linzs5FjmTjXTekw-DmsoabqS417_8oetNp8P6b_l6l1mYLraPp2NgVNnH5R7UN0',
      videoCount: 11200,
      description: 'Blonde performers and blonde-themed content',
      subcategories: ['Platinum Blonde', 'Dirty Blonde', 'Bleached', 'Natural Blonde'],
    },
    {
      id: 'blowjob',
      name: 'Blowjob',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXDrk6ohsEuSgELSDn0O-Rm7fBtnXlDVSa-4C0tcMtmhUy9BLWxuzNIH120jmaSQIqVdqTFGrBH5Fda58HtrOg01nLVv90OtoB0ITCiyo05LGimBqnpQpmuCGfDjrdMWrOP2k3hIV89pUsKaS0-8SnmBAGxn2rZ-dnSE8xiiXUNjmdszc5KOl-_i-7RmRBMLvGnjKx19vUgwNjflBj8crMWFtyXDUc6rBs2QRbpaPnuJEg0PWt3k7kbkRjsE0MKJSKI_eTvkCTElA',
      videoCount: 15600,
      description: 'Oral sex and blowjob content',
      isPopular: true,
      subcategories: ['Deepthroat', 'Face Fucking', 'Cum in Mouth', 'Swallow'],
    },
    {
      id: 'brunette',
      name: 'Brunette',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQhg6IMdZl_qASiIEL5oc3h9kqN_kzxJA8DQgC5t5dxX1zJV83poqcsSMOEw6zi4XlcjkgmQfXXm1J7iMfrAEO43_JKEJAG9n4OsaCA5JwZwOSa9WYdiD62TYA2oOzmss8IA-kM3sjniGHsiSDVVdri3aGFSenukbVvKqZpXVuFJGFIeK1N4WR_B6NuKfTvBt-82OGIFwdFruFmpPK9qrTkhXlBzrIwcpi23APgsOFzmXvNAHYCJUSRUPUvKBh1y2sj72pPQ5AW9E',
      videoCount: 18900,
      description: 'Brunette performers and brown-haired content',
      isPopular: true,
      subcategories: ['Dark Brown', 'Light Brown', 'Auburn', 'Chestnut'],
    },
    {
      id: 'cumshot',
      name: 'Cumshot',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDyPAfvZXQCu-9IWc-daGDQEbLN1frReRA_Uc-I_JDcdembVchOMW4yWk2SxQzddjdhABjLKmd0nQUFnYTGoa6WUMB3jgETmKxbo5glZzESq8r4p3ck4slON5iNtFyiORDaO2DjpCk2aUs1p7GfX1QflzRj-cr5hpsG_sA1qs0CBv3pIu5nImSV9aoa8fv57p70GAURrkCFOXwOiBU7zJnaSnJTmvtLgnx0NtGKH3O2Ob6vN9Fo0Ys7Emjqx0zXnzaqpXp0CW4cb0',
      videoCount: 13400,
      description: 'Cumshot and facial content',
      subcategories: ['Facial', 'Creampie', 'Cum Swallow', 'Bukkake'],
    },
    {
      id: 'deepthroat',
      name: 'Deepthroat',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFPJdC8NzFJqIHG908AAQqDcipqgj0rH8zExDR1WVplzoWYym5cHMVXLHcMPVH2R3YkVBmdlQBu61kYrE2v_7FjKVXKgzPP8nTZylLJc34fGf7W798NqoymxY8PMwXx3JwpmqKiiYoOFxRJ5iO7egQhrLkCrvgNVufBMF3VCqYMM2hY_-vPHq_gmbBQ7HQU5kD6kY7c6SaFC7ffFIFvk7JKmuOD9NZooj8GL1Am6GqEjpx8rDKMmwUNuPy_EmVzTVP48Sp5weFRvw',
      videoCount: 6780,
      description: 'Deep throat and intense oral content',
      subcategories: ['Gagging', 'Throat Bulge', 'No Hands', 'Extreme'],
    },
    {
      id: 'ebony',
      name: 'Ebony',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDS9_eD4aG8eWVcXQFJDBccEPKoM-IeB_wcUVnsJIRoNh1Tfj0ethf93I3upKHUMcsiQ_7dUNek58pjJw0LnFeh4b9OcUrkFRuKq5l5vSeUPD0T74Rs2OX539WfV8UQN5qDL-wTHL-m63jEBEebV74nVFNl3f1ltH9CUF5FQE9DManx-sMRoA9rw7W_iCCScTxSJeSZutfJ3sxBw7lGfi64N0jPfaegQ65ZL7daN6laPX4q6SDC6GH2DormgpTsIOSHhFRhySmBsg',
      videoCount: 9870,
      description: 'Ebony and Black performers content',
      subcategories: ['Dark Skin', 'Chocolate', 'Caramel', 'Mixed'],
    },
    {
      id: '18-year-old',
      name: '18 Year Old',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9_zgQ-7p8VmJku4Hm9XSbxazA-m8cxlCw2WqtxB4hT-JKN6Kbcyqv7YFkIbbCNaoldVDxajHHk0cjYYC6uToPxjNbf2yQ3IZR9tXuMqkllOmZE-JsWGoy8iuyFpiQRngqyW5K0xgs5ojXAJkjtvce6eFFA1Vzb27X8rvlMymEL4PmB3eGp8AsZ03Ru1l7cukHKSBDq53mm26Ie_0-le4Ywa37nhZDov-PSvo1QVwTrde7lkPJNal86vCAG2S8GcGMxfTXrSydfBk',
      videoCount: 2340,
      description: 'Young adult content featuring 18+ performers',
      subcategories: ['Fresh Faces', 'Newcomers', 'Debut', 'Teen'],
    },
  ];

  const handleCategoryPress = (category: Category) => {
    console.log('View category:', category.name);
  };

  const handleFilterPress = (filterId: string) => {
    setSelectedFilter(filterId);
    setShowFilters(false);
  };

  const handleSortPress = (sortId: string) => {
    setSortBy(sortId);
  };

  const CategoryCard: React.FC<{ category: Category }> = ({ category }) => (
    <ClickableCard
      style={{
        width: '48%',
        marginBottom: 16,
      }}
      onPress={() => handleCategoryPress(category)}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: category.thumbnail }}
          style={{
            width: '100%',
            height: 120,
            borderRadius: 12,
          }}
          resizeMode="cover"
        />
        {category.isPopular && (
          <View style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: colors.primary,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
            <Typography variant="labelSmall" color="onPrimary">
              Popular
            </Typography>
          </View>
        )}
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
            {category.videoCount.toLocaleString()}
          </Typography>
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <Typography variant="titleMedium" color="onSurface" numberOfLines={1}>
          {category.name}
        </Typography>
        <Typography variant="bodySmall" color="onSurfaceVariant" numberOfLines={2}>
          {category.description}
        </Typography>
        {category.subcategories && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
            {category.subcategories.slice(0, 2).map((sub) => (
              <View key={sub} style={{
                backgroundColor: colors.surfaceVariant,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 10,
              }}>
                <Typography variant="labelSmall" color="onSurfaceVariant">
                  {sub}
                </Typography>
              </View>
            ))}
            {category.subcategories.length > 2 && (
              <Typography variant="labelSmall" color="onSurfaceVariant">
                +{category.subcategories.length - 2} more
              </Typography>
            )}
          </View>
        )}
      </View>
    </ClickableCard>
  );

  const filteredCategories = React.useMemo(() => {
    let filtered = [...categories];

    switch (selectedFilter) {
      case 'popular':
        filtered = filtered.filter(cat => cat.isPopular);
        break;
      case 'new':
        filtered = filtered.filter(cat => cat.id.includes('18') || cat.id.includes('new'));
        break;
      case 'premium':
        filtered = filtered.filter(cat => cat.videoCount > 10000);
        break;
      default:
        break;
    }

    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'video_count':
        filtered.sort((a, b) => b.videoCount - a.videoCount);
        break;
      default:
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return filtered;
  }, [selectedFilter, sortBy]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title="Categories"
        leadingIcon="arrow_back"
        trailingIcons={['search', 'notifications']}
        onLeadingIconPress={() => console.log('Back pressed')}
        onTrailingIconPress={(icon) => console.log(`${icon} pressed`)}
        elevated={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header with Filters and Sort */}
        <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Typography variant="headlineLarge" color="onBackground">
              Browse Categories
            </Typography>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <SecondaryButton
                onPress={() => setShowFilters(!showFilters)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <Icon name="filter_list" size={18} color={colors.onSurface} />
                <Typography variant="labelLarge" color="onSurface">
                  Filter
                </Typography>
              </SecondaryButton>
              <SecondaryButton
                onPress={() => console.log('Show sort options')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <Icon name="sort" size={18} color={colors.onSurface} />
                <Typography variant="labelLarge" color="onSurface">
                  Sort
                </Typography>
              </SecondaryButton>
            </View>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, marginBottom: 16 }}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => handleFilterPress(filter.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedFilter === filter.id ? colors.primary : colors.surfaceVariant,
                }}
              >
                <Icon
                  name={filter.icon as any}
                  size={18}
                  color={selectedFilter === filter.id ? colors.onPrimary : colors.onSurfaceVariant}
                />
                <Typography
                  variant="labelLarge"
                  color={selectedFilter === filter.id ? 'onPrimary' : 'onSurfaceVariant'}
                >
                  {filter.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sort Options */}
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSortPress(option.id)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: sortBy === option.id ? colors.primary + '20' : colors.surfaceVariant,
                  borderWidth: sortBy === option.id ? 1 : 0,
                  borderColor: sortBy === option.id ? colors.primary : 'transparent',
                }}
              >
                <Typography
                  variant="bodyMedium"
                  color={sortBy === option.id ? 'primary' : 'onSurfaceVariant'}
                >
                  {option.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories Grid */}
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </View>
        </View>

        {/* Load More */}
        <View style={{ alignItems: 'center', paddingHorizontal: 16, marginTop: 24 }}>
          <SecondaryButton
            onPress={() => console.log('Load more categories')}
            style={{ minWidth: 200 }}
          >
            Load More Categories
          </SecondaryButton>
        </View>

        {/* Category Stats */}
        <View style={{ paddingHorizontal: 16, marginTop: 32, marginBottom: 16 }}>
          <ElevatedCard style={{ padding: 24 }}>
            <Typography variant="headlineSmall" color="onSurface" style={{ marginBottom: 16 }}>
              Category Overview
            </Typography>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Typography variant="displaySmall" color="primary">
                  {categories.length}
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  Total Categories
                </Typography>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Typography variant="displaySmall" color="primary">
                  {categories.reduce((sum, cat) => sum + cat.videoCount, 0).toLocaleString()}
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  Total Videos
                </Typography>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Typography variant="displaySmall" color="primary">
                  {categories.filter(cat => cat.isPopular).length}
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  Popular Categories
                </Typography>
              </View>
            </View>
          </ElevatedCard>
        </View>
      </ScrollView>
    </View>
  );
};