import React from 'react';
import { ScrollView, View, Image, TextInput } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, ClickableCard, AppBar, PlayNiteFooter } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton } from '../../shared/components/button';

interface VideoCardProps {
  title: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: string;
  onPress: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  category,
  thumbnail,
  duration,
  views,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <ClickableCard
      style={{
        width: 280,
        marginRight: 16,
      }}
      onPress={onPress}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: thumbnail }}
          style={{
            width: '100%',
            height: 160,
            borderRadius: 12,
          }}
          resizeMode="cover"
        />
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
            {duration}
          </Typography>
        </View>
        <View style={{
          position: 'absolute',
          top: 8,
          left: 8,
        }}>
          <View style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}>
            <Typography variant="labelSmall" color="onPrimary">
              {category}
            </Typography>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <Typography variant="titleMedium" color="onSurface" numberOfLines={2}>
          {title}
        </Typography>
        <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginTop: 4 }}>
          {views} views
        </Typography>
      </View>
    </ClickableCard>
  );
};

interface CategoryCardProps {
  title: string;
  thumbnail: string;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, thumbnail, onPress }) => {
  const { colors } = useTheme();

  return (
    <ClickableCard
      style={{
        width: 120,
        alignItems: 'center',
        marginRight: 16,
      }}
      onPress={onPress}
    >
      <Image
        source={{ uri: thumbnail }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
        }}
        resizeMode="cover"
      />
      <Typography
        variant="labelLarge"
        color="onSurface"
        align="center"
        style={{ marginTop: 8 }}
        numberOfLines={2}
      >
        {title}
      </Typography>
    </ClickableCard>
  );
};

export const UserHomepage: React.FC = () => {
  const { colors } = useTheme();

  const featuredVideo = {
    title: 'Explore the Latest in Adult Entertainment',
    description: 'Discover exclusive content, trending videos, and personalized recommendations tailored just for you.',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeUk7IvrGHRbtnNWlDAO5a9qEqEtoD88ct6wamRK0B6-gduYAJjeLPdP3aJPZtMp_lXqcxQ4F2J4B3z6UWZ0x0u7eR1Ukx5xB6HWJIdTHvAKJKow8HFY1u4sTXbWUEJdSdJk7kP2rgLTw85LBMtaWYZ_PVOtOi4uoyB1BIp61yf_e7g4QprVneSAkRmP9ANqIzm-DzkSCukYbvQFIHCo8jHmpx97XB2G5fflFa_v_Y_FR8I-YVLrztNvslYSUJLpC8hytW19M8aQk',
    category: 'Featured',
    ctaButtons: ['Start Exploring', 'Learn More'],
  };

  const [searchQuery, setSearchQuery] = React.useState('');

  const trendingVideos = [
    {
      id: 1,
      title: 'Intimate Encounters',
      category: 'Romance',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW_VWz7tnk7J2RRExFlu_UwFoWnO83vy-UWrmPLjGcnT2WCzyTXkS_ZfghPoQJ7Oad7mf8FL77gna1cwTyV-N5tmN3P57vPYTxAlQikLHJ8r54yVUyvtVT17cJus0YdBGMF11oBNdmPeGOR_3dILTZsWvnYK2w0CDZ7eT7nAwqm2KUt3KD_ysudLwiGKLJGz0PI9U-CLXgFCTw2X5EjZTbX9XVXE4Pd95aPtbf1nJG9ED7SPkF1TLXpByMDMYULNpL_P7minYV9fY',
      duration: '12:34',
      views: '125K',
    },
    {
      id: 2,
      title: 'Private Moments',
      category: 'Amateur',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQyjNH50BKw2kNEtuNbxZT73HTYole7XqSZMtb_QHaFmln5SQqVt1njyLtcuuwTU3IkjRaKdU8EnWXE21nWauotTDOiHA1XS1GJ7kcXC_8re4rZchWXIlKiuTf2yAsy_ty-GlwbGLEYz_dTGU040OMgr3kQQytw7kgM7ruab4_TNmX2H9TiVQj4LU66kRN1pzo1HBiM9rJgRjGYkUgrrzyVETqXs28mZwg_GJenhQOQT-DMNGds0guuR9rHACoisWJ1jEkobeoQuA',
      duration: '8:45',
      views: '89K',
    },
    {
      id: 3,
      title: 'Forbidden Desires',
      category: 'Fetish',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1-JLpHnmcrl6vlUnKcFoH3KSxMAJf_vbO59eE8nh06X_CUIV1u6GYrtBzp6MKkBy9-8QSjlVG5mDskUS6O_bh6lal2OJ55Sj7k6Bwd7rVNW3swgDD7kUio651EV62lS60dZ9-NOsR63Ei2zY3e50AsZ3HfPx58OT5MLDdEb1y177-zmNwqIMqRAauJruDY0PlvLnRo9gOiCiX6zj9Re3ZAiATc0qzjTycl3FjJQD5CHPdWzFVFbrkObeFwTCI0u2kkrzYsYSO6N8',
      duration: '15:22',
      views: '203K',
    },
    {
      id: 4,
      title: 'Secret Rendezvous',
      category: 'Lesbian',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLscO9Yzqox82AuH2IveLIGergnfn_uuIl9NmEUByz-sh9SyUaUjfHbfJ4cMly0G1G9heB-GhJEYpKcww-A3MAasC7qS6ibz0X2MbMPSyqkKMMTnieHr5kZqbmRJnoxfme6jc2YM51q7VPuwandZrtttZoGIMNB-V4159naFD49Y-rkAOlXYLZ_TXxZ-NavvpAFjdBLp8Zcn7xpnKIPmXebPQxSOUYtrxq7Xf6I_0lUXglxqruLdbfnJqwy3BQbg6IGN4H6I4TwLA',
      duration: '18:45',
      views: '156K',
    },
    {
      id: 5,
      title: 'Hidden Passions',
      category: 'Gay',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDju94xc2p0H75CORGLDMBZK2bnuro9XLo_gbNplockJ_lYsLGWykHZJmTcWuEUfe7KF6_HfgBEcDHLtlNW3BGya2p2QRN4_Oj37p0G5Id1MWLJPPRdschnVseK1OnKfRhIPYO6zHbHA-5lbQNVWRJ8ZR0wsbD9xmvtdyovLNzJOhWf_Fo13A7MRmlymbTVMz2rb92XybB0Q6fY0N0u6PqmgpjsoAjbkKjYh7PqV36gd2zflFkouymcIpju7j9-EDDOyndDfHilYTo',
      duration: '22:10',
      views: '278K',
    },
  ];

  const categories = [
    {
      id: 1,
      title: 'Amateur',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9_zgQ-7p8VmJku4Hm9XSbxazA-m8cxlCw2WqtxB4hT-JKN6Kbcyqv7YFkIbbCNaoldVDxajHHk0cjYYC6uToPxjNbf2yQ3IZR9tXuMqkllOmZE-JsWGoy8iuyFpiQRngqyW5K0xgs5ojXAJkjtvce6eFFA1Vzb27X8rvlMymEL4PmB3eGp8AsZ03Ru1l7cukHKSBDq53mm26Ie_0-le4Ywa37nhZDov-PSvo1QVwTrde7lkPJNal86vCAG2S8GcGMxfTXrSydfBk',
    },
    {
      id: 2,
      title: 'Fetish',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvtA2FFq8XD453zzrZp3iDhGtn3ff2x2mFCvrs98ykjWBRuRx2_V8aiDpAC78HE3rjg9WEf_YHCf5fG32TxLqzYma25CV49a0C7x64xq6pZ1oFCx9MNINgfpA6APF26Dk5YI97OkSbPZw1gIH8xEMMZbiloHNEHua_EhCBUgDjk2DuU0-9uBhNGBXSJQMqv1ZUNrGtg9AdqJsVw_G9ydQbPuJuGb0HB5Df0uyPjxl0a5oDd8WPyBFT_aWNFhbFi77ICztSZCrlmZU',
    },
    {
      id: 3,
      title: 'Lesbian',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Z3fiv4VTkOL9EkaT4kLa-GSbiJBEMvcG-lzxfrX7y4lt_vVTH9od6J__bGcq6Jhdq4UkakcqW88tmATFSfd-ijpIiN69qmylK7HusNwN8bghynNfX26OSU9rPQDm-BfzzyU7FVMWzj17PNSF-PCQV9fUrvP_pVLLjTRFdz3_QYEvzUk5FGcT3M_mS2fg2z5ieZy3viNjCPIqW71A0_5fCWJ5dIY-CN2xZZvUAGgo0zrA6zKzr4Po0IMKh8TMgkOu8_uFWdrvT8w',
    },
    {
      id: 4,
      title: 'Gay',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-i4BNb46Jb5bKKhjfputuHx6Eiy1lDp10jYAH7VUBRY3ixaOv-q_dEu3Cupado_D7-HU62JnNAaX71eP1YxPNPHsHxl5XIGkOVylggoJZs_eMRM78Hwier8trKqAjIzCoMc-dPoDwpDHKvASSdzGkwSgSffIoh_8tfZaL5UfDKJUKlZGXOiWENpDbFp7RJZ02jTL1tmL8v3G_x57RX0fDzJ9_vy6eMrdP9DvAGDhJO4LDGALgPzQChXvbYFUwUnsA0P1-O7XLbMs',
    },
    {
      id: 5,
      title: 'Mature',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQCSu9OEqGdn_Ag1OotBuDquh69D_vkDi7sC-f6LlIBlLd7hlikAcP8vRUONgdV7_qM60jpQNLmj3VdcjHrjiGTbfOMnsQtB8Eod4QtakHF7GPm13P23j5_jjRV9_YS0ZP0Ej8ER5h607k-RRFvfMOaIb2K1vkscrZ1l8w8xfcDln0PYHMyd8cy50s99bqxwez2Mq2SLB1AeSHjgHjWzmPt9MdJhaj5lv97XZ0dcenGnWYOTd9dtPVu8nCZssXFNJDXDw7NDGufRM',
    },
    {
      id: 6,
      title: 'Transgender',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEg9-4mAwZrsHJKaRZymRwvcoxhFypld4hHhyQ49z-a4tQv0-Hzjjyqc-4s9mVT19JtFdPC_v0hu13CuHy5AWt8MWJEUaFnEo3Mlbwv1MiEqgk9SwFgHtamhLSgQk19pmjliV4Raggk2BWsaI9W1Ltgv3e-Jgc_wk0zijoHOoqpxImz-NjhjttaNe0ru0IL6_ABAZXmsGBB92r0QGDkhO4fbuFyVsewZMTFfK4fEVqy3ejFfSi6CqZg3lXwvFJskAlBv6vp5g7XWo',
    },
    {
      id: 7,
      title: 'BDSM',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOvuA_WQfRCREogorHdwhRJSIunVqyoG16Z0oRIwrTSVT0S4iJlzWK5JOkT5iC5Wkwe0k8KU6zrOW7MLargUei6p7NHUqcOa9SnXilskRYn3mAlamjYjgEcZjKYUFfVdIDnWsax332YTQgVwhLpWvSqipCCDVR939TCJbxFp46Dils0mhe8-UYBa-00XbOhMTfUtYmErjF_tvRr2CFIlmCqibxVUNlWFJh9UjsbVgiApVSsZtM8aG_HLktB1IPeNYKPaHblCbEajM',
    },
    {
      id: 8,
      title: 'Roleplay',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8ldv8gBkdze78anN4uOzN4_yMICBT1J02O-69csdofsaPV-b1yDX6-wdyjiG-tWFKD1JHPGmoeHeQm0A7LETY878a-qN3xYULaQXjWFUWzmERilr8ho3e1dv89dfaqBCBWe9grJfruEJ1p4NlFQcMq6SIfNGCGWTiksD5W4Ab9-suO9e-lXbP60CM6Qn5Gmeum2FcT2uvcoSfG_leyBZRt4PtG-suXgk10MTpHPnKve66EUwCTFne178-1gf8oUJVJWrWnyfvzaU',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* App Bar */}
      <AppBar
        title="PlayNite"
        leadingIcon="movie"
        trailingIcons={['search', 'notifications']}
        onLeadingIconPress={() => console.log('Menu pressed')}
        onTrailingIconPress={(icon) => console.log(`${icon} pressed`)}
        elevated={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Featured Video Section */}
        <View style={{ marginBottom: 24 }}>
          <View style={{
            height: 300,
            position: 'relative',
            marginHorizontal: 16,
            marginTop: 16,
          }}>
            <Image
              source={{ uri: featuredVideo.thumbnail }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
              }}
              resizeMode="cover"
            />
            <View style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Icon name="play_circle" size={80} color="white" />
            </View>
            <View style={{
              position: 'absolute',
              top: 16,
              left: 16,
            }}>
              <View style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}>
                <Typography variant="labelMedium" color="onPrimary">
                  {featuredVideo.category}
                </Typography>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <Typography variant="headlineLarge" color="onBackground">
              {featuredVideo.title}
            </Typography>
            <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ marginTop: 8 }}>
              {featuredVideo.description}
            </Typography>

            {/* Call to Action Buttons */}
            <View style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 16,
            }}>
              <PrimaryButton
                onPress={() => console.log('Start Exploring pressed')}
                style={{ flex: 1 }}
              >
                {featuredVideo.ctaButtons[0]}
              </PrimaryButton>
              <SecondaryButton
                onPress={() => console.log('Learn More pressed')}
                style={{ flex: 1 }}
              >
                {featuredVideo.ctaButtons[1]}
              </SecondaryButton>
            </View>
          </View>
        </View>

        {/* Trending Now Section */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Typography variant="titleLarge" color="onBackground">
              Trending Now
            </Typography>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {trendingVideos.map((video) => (
              <VideoCard key={video.id} {...video} onPress={() => console.log('Play video', video.id)} />
            ))}
          </ScrollView>
        </View>

        {/* Categories Section */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Typography variant="titleLarge" color="onBackground">
              Categories
            </Typography>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                {...category}
                onPress={() => console.log('View category', category.title)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Videos Grid */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Typography variant="titleLarge" color="onBackground" style={{ marginBottom: 16 }}>
            Featured Videos
          </Typography>

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            {trendingVideos.map((video) => (
              <ClickableCard
                key={video.id}
                style={{
                  width: '48%',
                  marginBottom: 16,
                }}
                onPress={() => console.log('Play video', video.id)}
              >
                <Image
                  source={{ uri: video.thumbnail }}
                  style={{
                    width: '100%',
                    height: 120,
                    borderRadius: 12,
                  }}
                  resizeMode="cover"
                />
                <Typography
                  variant="bodyMedium"
                  color="onSurface"
                  style={{ marginTop: 8 }}
                  numberOfLines={2}
                >
                  {video.title}
                </Typography>
                <Typography variant="bodySmall" color="onSurfaceVariant">
                  {video.views} views
                </Typography>
              </ClickableCard>
            ))}
          </View>
        </View>

        {/* PlayNite Footer */}
        <PlayNiteFooter
          onPrivacyPress={() => console.log('Privacy pressed')}
          onTermsPress={() => console.log('Terms pressed')}
          onSupportPress={() => console.log('Support pressed')}
        />
      </ScrollView>
    </View>
  );
};