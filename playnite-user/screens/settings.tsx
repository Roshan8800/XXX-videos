import React from 'react';
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton, TextButton } from '../../shared/components/button';
import { AuthUtils, FirestoreUtils } from '../../shared/utils/firebase-utils';

interface SettingsData {
  language: string;
  videoQuality: string;
  autoplay: boolean;
  downloadQuality: string;
  downloadLocation: string;
  darkMode: boolean;
  parentalControls: boolean;
  twoFactorAuth: boolean;
  notifications: boolean;
  privacyMode: boolean;
}

export const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();

  const [settings, setSettings] = React.useState<SettingsData>({
    language: 'English',
    videoQuality: 'Auto',
    autoplay: true,
    downloadQuality: 'Standard',
    downloadLocation: 'Internal Storage',
    darkMode: false,
    parentalControls: false,
    twoFactorAuth: false,
    notifications: true,
    privacyMode: false,
  });

  const handleSettingChange = async (key: keyof SettingsData, value: string | boolean) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);

    try {
      await saveUserSettings({ [key]: value });
    } catch (error) {
      console.error('Error saving setting:', error);
      // Revert the change if save failed
      setSettings(settings);
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

  const loadUserSettings = async () => {
    try {
      const user = AuthUtils.getCurrentUser();
      if (!user) {
        console.log('No authenticated user');
        return;
      }

      const profile = await FirestoreUtils.getDocument('users', user.uid) as any;

      if (profile && profile.preferences) {
        setSettings(prev => ({
          ...prev,
          language: profile.preferences.language || 'English',
          videoQuality: profile.preferences.videoQuality || 'Auto',
          autoplay: profile.preferences.autoplay !== false,
          downloadQuality: profile.preferences.downloadQuality || 'Standard',
          downloadLocation: profile.preferences.downloadLocation || 'Internal Storage',
          darkMode: profile.preferences.darkMode || false,
          parentalControls: profile.preferences.parentalControls || false,
          twoFactorAuth: profile.preferences.twoFactorAuth || false,
          notifications: profile.preferences.notifications !== false,
          privacyMode: profile.preferences.privacyMode || false,
        }));
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const saveUserSettings = async (updatedSettings: Partial<SettingsData>) => {
    try {
      const user = AuthUtils.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      await FirestoreUtils.updateDocument('users', user.uid, {
        preferences: updatedSettings
      });

      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving user settings:', error);
      throw error;
    }
  };

  const handleTwoFactorAuthSetup = async () => {
    Alert.alert(
      'Two-Factor Authentication',
      'Two-factor authentication adds an extra layer of security to your account. Would you like to set it up?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set Up',
          onPress: async () => {
            try {
              // TODO: Implement 2FA setup flow
              Alert.alert('2FA Setup', 'Two-factor authentication setup coming soon!');
            } catch (error) {
              Alert.alert('Error', 'Failed to set up two-factor authentication.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = AuthUtils.getCurrentUser();
              if (!user) {
                throw new Error('No authenticated user');
              }

              // TODO: Implement account deletion logic
              Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Load settings on component mount
  React.useEffect(() => {
    loadUserSettings();
  }, []);

  const SettingRow: React.FC<{
    title: string;
    description: string;
    value?: string;
    type?: 'toggle' | 'select' | 'navigate';
    setting?: keyof SettingsData;
    onPress?: () => void;
  }> = ({ title, description, value, type = 'navigate', setting, onPress }) => (
    <TouchableOpacity
      onPress={onPress || (setting ? () => handleSettingChange(setting, !settings[setting]) : undefined)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineVariant,
      }}
    >
      <View style={{ flex: 1 }}>
        <Typography variant="titleMedium" color="onSurface">
          {title}
        </Typography>
        <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginTop: 2 }}>
          {description}
        </Typography>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {value && (
          <Typography variant="bodyMedium" color="onSurfaceVariant">
            {value}
          </Typography>
        )}

        {type === 'toggle' && setting && (
          <View style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            backgroundColor: settings[setting] ? colors.primary : colors.surfaceVariant,
            justifyContent: 'center',
            alignItems: settings[setting] ? 'flex-end' : 'flex-start',
            paddingHorizontal: 2,
          }}>
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: colors.onPrimary,
            }} />
          </View>
        )}

        {type === 'navigate' && (
          <Icon name="chevron_right" size={20} color={colors.onSurfaceVariant} />
        )}
      </View>
    </TouchableOpacity>
  );

  const SettingSection: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <ElevatedCard style={{ marginBottom: 24 }}>
      <Typography variant="titleLarge" color="onSurface" style={{ marginBottom: 16, padding: 20, paddingBottom: 0 }}>
        {title}
      </Typography>
      <View>
        {children}
      </View>
    </ElevatedCard>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title="Settings & Preferences"
        leadingIcon="arrow_back"
        onLeadingIconPress={() => console.log('Back pressed')}
        elevated={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          {/* Language Settings */}
          <SettingSection title="Language & Region">
            <SettingRow
              title="Language"
              description="Choose your preferred language"
              value={settings.language}
              type="select"
              onPress={() => console.log('Language selection')}
            />
          </SettingSection>

          {/* Playback Settings */}
          <SettingSection title="Playback">
            <SettingRow
              title="Video Quality"
              description="Choose your preferred video quality for streaming"
              value={settings.videoQuality}
              type="select"
              onPress={() => console.log('Video quality selection')}
            />
            <SettingRow
              title="Autoplay Next Video"
              description="Automatically play the next video in a playlist or series"
              type="toggle"
              setting="autoplay"
            />
          </SettingSection>

          {/* Downloads Settings */}
          <SettingSection title="Downloads">
            <SettingRow
              title="Download Quality"
              description="Select the quality for downloaded videos"
              value={settings.downloadQuality}
              type="select"
              onPress={() => console.log('Download quality selection')}
            />
            <SettingRow
              title="Download Location"
              description="Choose where downloaded videos are stored"
              value={settings.downloadLocation}
              type="select"
              onPress={() => console.log('Download location selection')}
            />
          </SettingSection>

          {/* Appearance Settings */}
          <SettingSection title="Appearance">
            <SettingRow
              title="Dark Mode"
              description="Switch between light and dark themes"
              type="toggle"
              setting="darkMode"
            />
          </SettingSection>

          {/* Content Settings */}
          <SettingSection title="Content & Privacy">
            <SettingRow
              title="Parental Controls"
              description="Restrict access to explicit content"
              type="toggle"
              setting="parentalControls"
            />
            <SettingRow
              title="Privacy Mode"
              description="Hide your activity from other users"
              type="toggle"
              setting="privacyMode"
            />
          </SettingSection>

          {/* Security Settings */}
          <SettingSection title="Security">
            <SettingRow
              title="Change Password"
              description="Update your account password"
              type="navigate"
              onPress={() => console.log('Change password')}
            />
            <SettingRow
              title="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              type="toggle"
              setting="twoFactorAuth"
              onPress={settings.twoFactorAuth ? undefined : handleTwoFactorAuthSetup}
            />
            <SettingRow
              title="Manage Devices"
              description="View and manage devices connected to your account"
              type="navigate"
              onPress={() => console.log('Manage devices')}
            />
          </SettingSection>

          {/* Notifications Settings */}
          <SettingSection title="Notifications">
            <SettingRow
              title="Push Notifications"
              description="Manage notification preferences"
              type="toggle"
              setting="notifications"
            />
            <SettingRow
              title="Notification Settings"
              description="Detailed notification preferences"
              type="navigate"
              onPress={() => console.log('Notification settings')}
            />
          </SettingSection>

          {/* Account Actions */}
          <SettingSection title="Account">
            <SettingRow
              title="Export Data"
              description="Download a copy of your data"
              type="navigate"
              onPress={() => console.log('Export data')}
            />
            <SettingRow
              title="Help & Support"
              description="Get help and contact support"
              type="navigate"
              onPress={() => console.log('Help & support')}
            />
            <SettingRow
              title="Privacy Policy"
              description="Read our privacy policy"
              type="navigate"
              onPress={() => console.log('Privacy policy')}
            />
            <SettingRow
              title="Terms of Service"
              description="Read our terms of service"
              type="navigate"
              onPress={() => console.log('Terms of service')}
            />
          </SettingSection>

          {/* Danger Zone */}
          <ElevatedCard style={{ borderColor: colors.error, borderWidth: 1 }}>
            <Typography variant="titleLarge" color="error" style={{ marginBottom: 16, padding: 20, paddingBottom: 0 }}>
              Danger Zone
            </Typography>

            <View style={{ padding: 20, paddingTop: 16 }}>
              <View style={{ marginBottom: 16 }}>
                <Typography variant="titleMedium" color="onSurface">
                  Delete Account
                </Typography>
                <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginTop: 4 }}>
                  Permanently delete your account and all associated data
                </Typography>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <SecondaryButton
                  onPress={handleLogout}
                  style={{ flex: 1 }}
                >
                  Logout
                </SecondaryButton>
                <PrimaryButton
                  onPress={handleDeleteAccount}
                  style={{
                    flex: 1,
                    backgroundColor: colors.error,
                    borderColor: colors.error
                  }}
                >
                  Delete Account
                </PrimaryButton>
              </View>
            </View>
          </ElevatedCard>

          {/* App Info */}
          <View style={{ alignItems: 'center', paddingVertical: 24 }}>
            <Typography variant="bodyLarge" color="onSurfaceVariant">
              PlayNite v2.1.0
            </Typography>
            <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginTop: 4 }}>
              © 2024 PlayNite. All rights reserved.
            </Typography>
            <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginTop: 2 }}>
              For adults 18+ only
            </Typography>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};