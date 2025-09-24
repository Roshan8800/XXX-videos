import React from 'react';
import { ScrollView, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ClickableCard, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton } from '../../shared/components/button';

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadDate: string;
  uploader: string;
  category: string;
  isPremium?: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'category';
}

interface FilterOption {
  id: string;
  label: string;
  isSelected: boolean;
}

export const SearchResultsScreen: React.FC = () => {
  const { colors } = useTheme();

  const searchQuery = 'amateur couple';
  const totalResults = 1247;

  const searchResults: SearchResult[] = [
    {
      id: '1',
      title: 'Amateur Couple First Time Experience',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW_VWz7tnk7J2RRExFlu_UwFoWnO83vy-UWrmPLjGcnT2WCzyTXkS_ZfghPoQJ7Oad7mf8FL77gna1cwTyV-N5tmN3P57vPYTxAlQikLHJ8r54yVUyvtVT17cJus0YdBGMF11oBNdmPeGOR_3dILTZsWvnYK2w0CDZ7eT7nAwqm2KUt3KD_ysudLwiGKLJGz0PI9U-CLXgFCTw2X5EjZTbX9XVXE4Pd95aPtbf1nJG9ED7SPkF1TLXpByMDMYULNpL_P7minYV9fY',
      duration: '15:30',
      views: '125K',
      uploadDate: '2 days ago',
      uploader: 'RealCoupleFun',
      category: 'Amateur',
      isPremium: false,
    },
    {
      id: '2',
      title: 'Homemade Passionate Moments',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQyjNH50BKw2kNEtuNbxZT73HTYole7XqSZMtb_QHaFmln5SQqVt1njyLtcuuwTU3IkjRaKdU8EnWXE21nWauotTDOiHA1XS1GJ7kcXC_8re4rZchWXIlKiuTf2yAsy_ty-GlwbGLEYz_dTGU040OMgr3kQQytw7kgM7ruab4_TNmX2H9TiVQj4LU66kRN1pzo1HBiM9rJgRjGYkUgrrzyVETqXs28mZwg_GJenhQOQT-DMNGds0guuR9rHACoisWJ1jEkobeoQuA',
      duration: '22:45',
      views: '89K',
      uploadDate: '1 week ago',
      uploader: 'HomeSweetHome',
      category: 'Amateur',
      isPremium: true,
    },
    {
      id: '3',
      title: 'Real Life Intimacy Uncensored',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1-JLpHnmcrl6vlUnKcFoH3KSxMAJf_vbO59eE8nh06X_CUIV1u6GYrtBzp6MKkBy9-8QSjlVG5mDskUS6O_bh6lal2OJ55Sj7k6Bwd7rVNW3swgDD7kUio651EV62lS60dZ9-NOsR63Ei2zY3e50AsZ3HfPx58OT5MLDdEb1y177-zmNwqIMqRAauJruDY0PlvLnRo9gOiCiX6zj9Re3ZAiATc0qzjTycl3FjJQD5CHPdWzFVFbrkObeFwTCI0u2kkrzYsYSO6N8',
      duration: '18:20',
      views: '203K',
      uploadDate: '3 days ago',
      uploader: 'AuthenticLove',
      category: 'Amateur',
      isPremium: false,
    },
    {
      id: '4',
      title: 'Couple\'s Private Adventure',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLscO9Yzqox82AuH2IveLIGergnfn_uuIl9NmEUByz-sh9SyUaUjfHbfJ4cMly0G1G9heB-GhJEYpKcww-A3MAasC7qS6ibz0X2MbMPSyqkKMMTnieHr5kZqbmRJnoxfme6jc2YM51q7VPuwandZrtttZoGIMNB-V4159naFD49Y-rkAOlXYLZ_TXxZ-NavvpAFjdBLp8Zcn7xpnKIPmXebPQxSOUYtrxq7Xf6I_0lUXglxqruLdbfnJqwy3BQbg6IGN4H6I4TwLA',
      duration: '25:15',
      views: '156K',
      uploadDate: '5 days ago',
      uploader: 'TrueConnection',
      category: 'Amateur',
      isPremium: false,
    },
    {
      id: '5',
      title: 'Spontaneous Romantic Moments',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDju94xc2p0H75CORGLDMBZK2bnuro9XLo_gbNplockJ_lYsLGWykHZJmTcWuEUfe7KF6_HfgBEcDHLtlNW3BGya2p2QRN4_Oj37p0G5Id1MWLJPPRdschnVseK1OnKfRhIPYO6zHbHA-5lbQNVWRJ8ZR0wsbD9xmvtdyovLNzJOhWf_Fo13A7MRmlymbTVMz2rb92XybB0Q6fY0N0u6PqmgpjsoAjbkKjYh7PqV36gd2zflFkouymcIpju7j9-EDDOyndDfHilYTo',
      duration: '19:45',
      views: '278K',
      uploadDate: '1 day ago',
      uploader: 'PassionatePair',
      category: 'Amateur',
      isPremium: true,
    },
    {
      id: '6',
      title: 'Intimate Home Video Collection',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsGO9o5zny5mH50xBPI1587UxKWOz_yin4Cq8-JBwbtzp796uIPpj_Ho3AhiDhJmB_kZLex2giN4yWDskURb4hv8xYaZconFqtT24SR740063rqgCP-K4Q_KnIZ3NiAh979b389HUXRmwrWGJnzmVGzyPORWQLB7udMl3-r1CaQXc0tepefxgnMHsbCZFOBgy1uLbbDbn492EmMQNba-oC_qV3M4EbjMBLz1f54rDacstTfq4XgJwMZc5owitkTMBJkHeC7iTVM1E',
      duration: '28:30',
      views: '92K',
      uploadDate: '4 days ago',
      uploader: 'HomeIntimacy',
      category: 'Amateur',
      isPremium: false,
    },
  ];

  const searchSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'amateur couple homemade', type: 'recent' },
    { id: '2', text: 'real amateur sex', type: 'popular' },
    { id: '3', text: 'couple first time', type: 'recent' },
    { id: '4', text: 'homemade porn', type: 'popular' },
    { id: '5', text: 'amateur lesbian', type: 'category' },
    { id: '6', text: 'real couple sex', type: 'popular' },
  ];

  const filterOptions: FilterOption[] = [
    { id: 'relevance', label: 'Most Relevant', isSelected: true },
    { id: 'recent', label: 'Recently Added', isSelected: false },
    { id: 'popular', label: 'Most Viewed', isSelected: false },
    { id: 'duration', label: 'Longest', isSelected: false },
  ];

  const sortOptions: FilterOption[] = [
    { id: 'all', label: 'All Content', isSelected: true },
    { id: 'free', label: 'Free Only', isSelected: false },
    { id: 'premium', label: 'Premium Only', isSelected: false },
  ];

  const [selectedFilter, setSelectedFilter] = React.useState('relevance');
  const [selectedSort, setSelectedSort] = React.useState('all');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const handleResultPress = (result: SearchResult) => {
    console.log('Play video:', result.title);
  };

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    console.log('Search for:', suggestion.text);
  };

  const SearchResultCard: React.FC<{ result: SearchResult }> = ({ result }) => (
    <ClickableCard
      style={{
        marginBottom: 16,
        overflow: 'hidden',
      }}
      onPress={() => handleResultPress(result)}
    >
      <View style={{
        flexDirection: 'row',
        padding: 12,
      }}>
        <View style={{ position: 'relative', marginRight: 12 }}>
          <Image
            source={{ uri: result.thumbnail }}
            style={{
              width: 120,
              height: 68,
              borderRadius: 8,
            }}
            resizeMode="cover"
          />
          <View style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 2,
          }}>
            <Typography variant="bodySmall" color="onPrimary">
              {result.duration}
            </Typography>
          </View>
          {result.isPremium && (
            <View style={{
              position: 'absolute',
              top: 4,
              left: 4,
              backgroundColor: '#FFD700',
              paddingHorizontal: 4,
              paddingVertical: 2,
              borderRadius: 2,
            }}>
              <Typography variant="bodySmall" color="onPrimary">
                Premium
              </Typography>
            </View>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Typography
            variant="bodyLarge"
            color="onSurface"
            numberOfLines={2}
            style={{ marginBottom: 4 }}
          >
            {result.title}
          </Typography>
          <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginBottom: 2 }}>
            {result.uploader} · {result.views} views · {result.uploadDate}
          </Typography>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Typography variant="bodySmall" color="onSurfaceVariant">
              {result.category}
            </Typography>
          </View>
        </View>
      </View>
    </ClickableCard>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* App Bar */}
      <AppBar
        title={`Search: "${searchQuery}"`}
        leadingIcon="arrow_back"
        trailingIcons={['search', 'filter_list']}
        onLeadingIconPress={() => console.log('Back pressed')}
        onTrailingIconPress={(icon) => console.log(`${icon} pressed`)}
        elevated={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Search Summary */}
        <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 16 }}>
          <Typography variant="bodyLarge" color="onSurfaceVariant">
            About {totalResults.toLocaleString()} results for "{searchQuery}"
          </Typography>
        </View>

        {/* Search Suggestions */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Typography variant="titleLarge" color="onBackground" style={{ marginBottom: 12 }}>
            Search Suggestions
          </Typography>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {searchSuggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                onPress={() => handleSuggestionPress(suggestion)}
                style={{
                  backgroundColor: colors.surfaceVariant,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  {suggestion.text}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Filters and Sort */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <Typography variant="titleLarge" color="onBackground" style={{ flex: 1 }}>
              Filter & Sort
            </Typography>
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              style={{
                padding: 8,
                backgroundColor: colors.surfaceVariant,
                borderRadius: 8,
              }}
            >
              <Typography variant="labelMedium" color="onSurfaceVariant">
                {viewMode === 'grid' ? 'List' : 'Grid'}
              </Typography>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginBottom: 8 }}>
                Sort by
              </Typography>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {filterOptions.map((filter) => (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => setSelectedFilter(filter.id)}
                    style={{
                      backgroundColor: filter.isSelected ? colors.primary : colors.surfaceVariant,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                    }}
                  >
                    <Typography
                      variant="bodySmall"
                      color={filter.isSelected ? 'onPrimary' : 'onSurfaceVariant'}
                    >
                      {filter.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={{ flex: 1 }}>
              <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginBottom: 8 }}>
                Content type
              </Typography>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {sortOptions.map((sort) => (
                  <TouchableOpacity
                    key={sort.id}
                    onPress={() => setSelectedSort(sort.id)}
                    style={{
                      backgroundColor: sort.isSelected ? colors.primary : colors.surfaceVariant,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                    }}
                  >
                    <Typography
                      variant="bodySmall"
                      color={sort.isSelected ? 'onPrimary' : 'onSurfaceVariant'}
                    >
                      {sort.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Search Results */}
        <View style={{ paddingHorizontal: 16 }}>
          {searchResults.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </View>

        {/* Load More */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <SecondaryButton
            onPress={() => console.log('Load more results')}
            style={{ alignSelf: 'center' }}
          >
            Load More Results
          </SecondaryButton>
        </View>
      </ScrollView>
    </View>
  );
};