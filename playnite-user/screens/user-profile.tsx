import React from 'react';
import { ScrollView, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, ClickableCard, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton, TextButton } from '../../shared/components/button';
import { AuthUtils, FirestoreUtils, StorageUtils } from '../../shared/utils/firebase-utils';

interface UserProfileData {
  username: string;
  email: string;
  displayName: string;
  bio: string;
  language: string;
  contentFiltering: string;
  profilePicture?: string;
  preferences?: {
    notifications: boolean;
    autoplay: boolean;
    quality: string;
    theme: string;
  };
  stats?: {
    videosWatched: number;
    totalWatchTime: number;
    favoriteCategories: string[];
  };
}

interface UserProfileErrors {
  username?: string;
  email?: string;
  displayName?: string;
}

type ProfileSection = 'account' | 'subscription' | 'payment' | 'history' | 'notifications' | 'privacy';

export const UserProfileScreen: React.FC = () => {
  const { colors } = useTheme();
  const [activeSection, setActiveSection] = React.useState<ProfileSection>('account');
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState<UserProfileData>({
    username: '',
    email: '',
    displayName: '',
    bio: '',
    language: 'English',
    contentFiltering: 'Moderate',
  });
  const [errors, setErrors] = React.useState<UserProfileErrors>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  const validateProfile = (): boolean => {
    const newErrors: UserProfileErrors = {};

    if (!profileData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (profileData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!profileData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof UserProfileErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof UserProfileErrors]: undefined }));
    }
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    setIsLoading(true);
    try {
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      // Update profile in Firestore
      await FirestoreUtils.updateDocument('users', currentUser.uid, {
        username: profileData.username,
        email: profileData.email,
        displayName: profileData.displayName,
        bio: profileData.bio,
        preferences: {
          ...profileData.preferences,
          language: profileData.language,
          contentFiltering: profileData.contentFiltering,
        }
      });

      // Update Firebase Auth profile if display name or email changed
      if (profileData.displayName !== currentUser.displayName) {
        await AuthUtils.updateUserProfile({ displayName: profileData.displayName });
      }

      setIsEditing(false);
      Alert.alert('Success', 'Your profile has been updated successfully.');
    } catch (error: any) {
      console.error('Error updating profile:', error);

      let errorMessage = 'Failed to update profile. Please try again.';

      if (error.code === 'permission-denied') {
        errorMessage = 'You do not have permission to update this profile.';
      } else if (error.code === 'not-found') {
        errorMessage = 'Profile not found. Please try logging in again.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const user = AuthUtils.getCurrentUser();
      if (!user) {
        console.log('No authenticated user');
        return;
      }

      setCurrentUser(user);
      const profile = await FirestoreUtils.getDocument('users', user.uid) as any;

      if (profile) {
        setProfileData({
          username: profile.username || '',
          email: profile.email || user.email || '',
          displayName: profile.displayName || user.displayName || '',
          bio: profile.bio || '',
          language: profile.preferences?.language || 'English',
          contentFiltering: profile.preferences?.contentFiltering || 'Moderate',
          profilePicture: profile.profilePicture || user.photoURL,
          preferences: profile.preferences,
          stats: profile.stats,
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      Alert.alert('Error', 'Failed to load profile data.');
    }
  };

  const handleProfilePictureUpload = async () => {
    try {
      setIsUploadingImage(true);
      // TODO: Implement image picker to select image
      // For now, we'll use a placeholder
      const imageUrl = 'https://via.placeholder.com/150';

      // Update profile picture in Firestore
      if (currentUser) {
        await FirestoreUtils.updateDocument('users', currentUser.uid, {
          profilePicture: imageUrl
        });

        // Update Firebase Auth profile
        await AuthUtils.updateUserProfile({ photoURL: imageUrl });

        setProfileData(prev => ({ ...prev, profilePicture: imageUrl }));
        Alert.alert('Success', 'Profile picture updated successfully.');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', 'Failed to upload profile picture.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthUtils.signOutUser();
              console.log('User logged out');
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Load user profile on component mount
  React.useEffect(() => {
    loadUserProfile();
  }, []);

  const renderSidebar = () => (
    <View style={{
      width: 280,
      backgroundColor: colors.surface,
      borderRightWidth: 1,
      borderRightColor: colors.outlineVariant,
      paddingVertical: 24,
      paddingHorizontal: 16,
    }}>
      {/* User Info */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <TouchableOpacity
          onPress={handleProfilePictureUpload}
          disabled={isUploadingImage}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            overflow: 'hidden',
          }}
        >
          {profileData.profilePicture ? (
            <View style={{
              width: '100%',
              height: '100%',
              backgroundColor: colors.surfaceVariant,
            }}>
              {/* TODO: Add Image component to display profile picture */}
              <Typography variant="bodySmall" color="onSurfaceVariant">
                Image
              </Typography>
            </View>
          ) : (
            <Typography variant="headlineSmall" color="onPrimary">
              {profileData.displayName.charAt(0).toUpperCase()}
            </Typography>
          )}
          {isUploadingImage && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Icon name="sync" size={24} color={colors.onPrimary} />
            </View>
          )}
        </TouchableOpacity>
        <Typography variant="titleLarge" color="onSurface">
          {profileData.displayName || 'Loading...'}
        </Typography>
        <Typography variant="bodyMedium" color="onSurfaceVariant">
          Premium Member
        </Typography>
      </View>

      {/* Navigation */}
      <View style={{ gap: 4 }}>
        {[
          { key: 'account', label: 'Account', icon: 'person' },
          { key: 'subscription', label: 'Subscription', icon: 'subscriptions' },
          { key: 'payment', label: 'Payment Methods', icon: 'credit_card' },
          { key: 'history', label: 'Watch History', icon: 'history' },
          { key: 'notifications', label: 'Notifications', icon: 'notifications' },
          { key: 'privacy', label: 'Privacy', icon: 'security' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => setActiveSection(item.key as ProfileSection)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: activeSection === item.key ? colors.primary + '20' : 'transparent',
            }}
          >
            <Icon
              name={item.icon as any}
              size={24}
              color={activeSection === item.key ? colors.primary : colors.onSurfaceVariant}
            />
            <Typography
              variant="bodyLarge"
              color={activeSection === item.key ? 'primary' : 'onSurfaceVariant'}
            >
              {item.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <View style={{ marginTop: 'auto', paddingTop: 24 }}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Icon name="close" size={24} color={colors.error} />
          <Typography variant="bodyLarge" color="error">
            Logout
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAccountSection = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ gap: 24 }}>
        {/* Profile Section */}
        <ElevatedCard style={{ padding: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Typography variant="headlineSmall" color="onSurface">
              Profile Information
            </Typography>
            <SecondaryButton
              onPress={() => setIsEditing(!isEditing)}
              style={{ minWidth: 80 }}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </SecondaryButton>
          </View>

          <View style={{ gap: 20 }}>
            {/* Display Name */}
            <View>
              <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
                Display Name *
              </Typography>
              {isEditing ? (
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: errors.displayName ? colors.error : colors.outline,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    backgroundColor: colors.surfaceVariant,
                    color: colors.onSurface,
                  }}
                  value={profileData.displayName}
                  onChangeText={(value) => handleInputChange('displayName', value)}
                  placeholder="Enter your display name"
                  placeholderTextColor={colors.onSurfaceVariant}
                />
              ) : (
                <Typography variant="bodyLarge" color="onSurface">
                  {profileData.displayName}
                </Typography>
              )}
              {errors.displayName && (
                <Typography variant="bodySmall" color="error" style={{ marginTop: 4 }}>
                  {errors.displayName}
                </Typography>
              )}
            </View>

            {/* Username */}
            <View>
              <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
                Username *
              </Typography>
              {isEditing ? (
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: errors.username ? colors.error : colors.outline,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    backgroundColor: colors.surfaceVariant,
                    color: colors.onSurface,
                  }}
                  value={profileData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.onSurfaceVariant}
                  autoCapitalize="none"
                />
              ) : (
                <Typography variant="bodyLarge" color="onSurface">
                  @{profileData.username}
                </Typography>
              )}
              {errors.username && (
                <Typography variant="bodySmall" color="error" style={{ marginTop: 4 }}>
                  {errors.username}
                </Typography>
              )}
            </View>

            {/* Email */}
            <View>
              <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
                Email Address *
              </Typography>
              {isEditing ? (
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: errors.email ? colors.error : colors.outline,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    backgroundColor: colors.surfaceVariant,
                    color: colors.onSurface,
                  }}
                  value={profileData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.onSurfaceVariant}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Typography variant="bodyLarge" color="onSurface">
                  {profileData.email}
                </Typography>
              )}
              {errors.email && (
                <Typography variant="bodySmall" color="error" style={{ marginTop: 4 }}>
                  {errors.email}
                </Typography>
              )}
            </View>

            {/* Bio */}
            <View>
              <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
                Bio
              </Typography>
              {isEditing ? (
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.outline,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    backgroundColor: colors.surfaceVariant,
                    color: colors.onSurface,
                    height: 80,
                    textAlignVertical: 'top',
                  }}
                  value={profileData.bio}
                  onChangeText={(value) => handleInputChange('bio', value)}
                  placeholder="Tell us about yourself"
                  placeholderTextColor={colors.onSurfaceVariant}
                  multiline
                  numberOfLines={3}
                />
              ) : (
                <Typography variant="bodyLarge" color="onSurface">
                  {profileData.bio}
                </Typography>
              )}
            </View>

            {isEditing && (
              <PrimaryButton
                onPress={handleSaveProfile}
                disabled={isLoading}
                style={{ marginTop: 16 }}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </PrimaryButton>
            )}
          </View>
        </ElevatedCard>

        {/* Preferences Section */}
        <ElevatedCard style={{ padding: 24 }}>
          <Typography variant="headlineSmall" color="onSurface" style={{ marginBottom: 24 }}>
            Content Preferences
          </Typography>

          <View style={{ gap: 20 }}>
            {/* Language */}
            <View>
              <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
                Language
              </Typography>
              <View style={{
                borderWidth: 1,
                borderColor: colors.outline,
                borderRadius: 12,
                backgroundColor: colors.surfaceVariant,
              }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Typography variant="bodyLarge" color="onSurface">
                    {profileData.language}
                  </Typography>
                  <Icon name="expand_more" size={20} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Content Filtering */}
            <View>
              <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
                Content Filtering
              </Typography>
              <View style={{
                borderWidth: 1,
                borderColor: colors.outline,
                borderRadius: 12,
                backgroundColor: colors.surfaceVariant,
              }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Typography variant="bodyLarge" color="onSurface">
                    {profileData.contentFiltering}
                  </Typography>
                  <Icon name="expand_more" size={20} color={colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ElevatedCard>
      </View>
    </ScrollView>
  );

  const renderSubscriptionSection = () => (
    <View style={{ padding: 24 }}>
      <Typography variant="headlineMedium" color="onSurface" style={{ marginBottom: 24 }}>
        Subscription Management
      </Typography>

      <ElevatedCard style={{ padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Icon name="star" size={30} color={colors.onPrimary} />
          </View>
          <Typography variant="headlineSmall" color="onSurface">
            Premium Plan
          </Typography>
          <Typography variant="bodyLarge" color="onSurfaceVariant">
            $19.99/month • Next billing: Dec 15, 2024
          </Typography>
        </View>

        <View style={{ gap: 16 }}>
          <ClickableCard
            style={{ padding: 16 }}
            onPress={() => console.log('View plan details')}
          >
            <Typography variant="titleMedium" color="onSurface">
              Current Plan Features
            </Typography>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              • Unlimited video streaming
              • HD and 4K quality
              • Download for offline viewing
              • Ad-free experience
            </Typography>
          </ClickableCard>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <PrimaryButton
              onPress={() => console.log('Manage subscription')}
              style={{ flex: 1 }}
            >
              Manage Plan
            </PrimaryButton>
            <SecondaryButton
              onPress={() => console.log('View billing history')}
              style={{ flex: 1 }}
            >
              Billing History
            </SecondaryButton>
          </View>
        </View>
      </ElevatedCard>
    </View>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountSection();
      case 'subscription':
        return renderSubscriptionSection();
      case 'payment':
        return (
          <View style={{ padding: 24 }}>
            <Typography variant="headlineMedium" color="onSurface">
              Payment Methods
            </Typography>
            <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ marginTop: 16 }}>
              Payment methods management coming soon...
            </Typography>
          </View>
        );
      case 'history':
        return (
          <View style={{ padding: 24 }}>
            <Typography variant="headlineMedium" color="onSurface">
              Watch History
            </Typography>
            <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ marginTop: 16 }}>
              Watch history management coming soon...
            </Typography>
          </View>
        );
      case 'notifications':
        return (
          <View style={{ padding: 24 }}>
            <Typography variant="headlineMedium" color="onSurface">
              Notifications
            </Typography>
            <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ marginTop: 16 }}>
              Notification settings coming soon...
            </Typography>
          </View>
        );
      case 'privacy':
        return (
          <View style={{ padding: 24 }}>
            <Typography variant="headlineMedium" color="onSurface">
              Privacy Settings
            </Typography>
            <Typography variant="bodyLarge" color="onSurfaceVariant" style={{ marginTop: 16 }}>
              Privacy settings coming soon...
            </Typography>
          </View>
        );
      default:
        return renderAccountSection();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title="My Profile"
        leadingIcon="menu"
        onLeadingIconPress={() => console.log('Menu pressed')}
        elevated={true}
      />

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {renderSidebar()}
        <View style={{ flex: 1 }}>
          {renderMainContent()}
        </View>
      </View>
    </View>
  );
};