import React, { useState } from 'react';
import { Alert, ScrollView, Switch, TextInput, TouchableOpacity, View } from 'react-native';
import { ElevatedCard } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';

interface SettingSection {
  title: string;
  description: string;
  icon: string;
  settings: SettingItem[];
}

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'input' | 'select' | 'button';
  value?: any;
  options?: string[];
}

export const SettingsPanel: React.FC = () => {
  const { colors } = useTheme();
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'PlayNite',
    siteDescription: 'Premium video streaming platform',
    maintenanceMode: false,
    registrationEnabled: true,

    // Content Settings
    maxVideoDuration: '60',
    maxFileSize: '500',
    allowedFormats: 'mp4,mov,avi',
    autoApproveContent: false,

    // User Settings
    maxLoginAttempts: '5',
    sessionTimeout: '30',
    requireEmailVerification: true,
    enableTwoFactor: false,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,

    // Security Settings
    passwordMinLength: '8',
    requireSpecialChars: true,
    enableRateLimiting: true,
    logSuspiciousActivity: true,
  });

  const settingSections: SettingSection[] = [
    {
      title: 'General Settings',
      description: 'Basic platform configuration',
      icon: 'settings',
      settings: [
        {
          id: 'siteName',
          title: 'Site Name',
          description: 'Display name for the platform',
          type: 'input',
          value: settings.siteName,
        },
        {
          id: 'siteDescription',
          title: 'Site Description',
          description: 'Brief description of the platform',
          type: 'input',
          value: settings.siteDescription,
        },
        {
          id: 'maintenanceMode',
          title: 'Maintenance Mode',
          description: 'Temporarily disable user access',
          type: 'toggle',
          value: settings.maintenanceMode,
        },
        {
          id: 'registrationEnabled',
          title: 'User Registration',
          description: 'Allow new users to register',
          type: 'toggle',
          value: settings.registrationEnabled,
        },
      ],
    },
    {
      title: 'Content Settings',
      description: 'Video and content upload configuration',
      icon: 'video_library',
      settings: [
        {
          id: 'maxVideoDuration',
          title: 'Max Video Duration (minutes)',
          description: 'Maximum allowed video length',
          type: 'input',
          value: settings.maxVideoDuration,
        },
        {
          id: 'maxFileSize',
          title: 'Max File Size (MB)',
          description: 'Maximum upload file size',
          type: 'input',
          value: settings.maxFileSize,
        },
        {
          id: 'allowedFormats',
          title: 'Allowed Formats',
          description: 'Comma-separated list of allowed file formats',
          type: 'input',
          value: settings.allowedFormats,
        },
        {
          id: 'autoApproveContent',
          title: 'Auto-approve Content',
          description: 'Automatically approve uploaded content',
          type: 'toggle',
          value: settings.autoApproveContent,
        },
      ],
    },
    {
      title: 'User Settings',
      description: 'User account and authentication settings',
      icon: 'people',
      settings: [
        {
          id: 'maxLoginAttempts',
          title: 'Max Login Attempts',
          description: 'Number of failed login attempts before lockout',
          type: 'input',
          value: settings.maxLoginAttempts,
        },
        {
          id: 'sessionTimeout',
          title: 'Session Timeout (minutes)',
          description: 'Automatic logout after inactivity',
          type: 'input',
          value: settings.sessionTimeout,
        },
        {
          id: 'requireEmailVerification',
          title: 'Email Verification',
          description: 'Require email verification for new accounts',
          type: 'toggle',
          value: settings.requireEmailVerification,
        },
        {
          id: 'enableTwoFactor',
          title: 'Two-Factor Authentication',
          description: 'Enable 2FA for all users',
          type: 'toggle',
          value: settings.enableTwoFactor,
        },
      ],
    },
    {
      title: 'Notification Settings',
      description: 'Email, push, and SMS notification preferences',
      icon: 'notifications',
      settings: [
        {
          id: 'emailNotifications',
          title: 'Email Notifications',
          description: 'Send email notifications to users',
          type: 'toggle',
          value: settings.emailNotifications,
        },
        {
          id: 'pushNotifications',
          title: 'Push Notifications',
          description: 'Send push notifications to mobile apps',
          type: 'toggle',
          value: settings.pushNotifications,
        },
        {
          id: 'smsNotifications',
          title: 'SMS Notifications',
          description: 'Send SMS notifications',
          type: 'toggle',
          value: settings.smsNotifications,
        },
        {
          id: 'marketingEmails',
          title: 'Marketing Emails',
          description: 'Send promotional emails',
          type: 'toggle',
          value: settings.marketingEmails,
        },
      ],
    },
    {
      title: 'Security Settings',
      description: 'Security and access control settings',
      icon: 'security',
      settings: [
        {
          id: 'passwordMinLength',
          title: 'Minimum Password Length',
          description: 'Minimum characters required for passwords',
          type: 'input',
          value: settings.passwordMinLength,
        },
        {
          id: 'requireSpecialChars',
          title: 'Require Special Characters',
          description: 'Passwords must contain special characters',
          type: 'toggle',
          value: settings.requireSpecialChars,
        },
        {
          id: 'enableRateLimiting',
          title: 'Rate Limiting',
          description: 'Enable API rate limiting',
          type: 'toggle',
          value: settings.enableRateLimiting,
        },
        {
          id: 'logSuspiciousActivity',
          title: 'Log Suspicious Activity',
          description: 'Log and monitor suspicious user behavior',
          type: 'toggle',
          value: settings.logSuspiciousActivity,
        },
      ],
    },
  ];

  const handleSettingChange = (sectionIndex: number, settingId: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: value,
    }));
  };

  const handleSaveSettings = () => {
    Alert.alert(
      'Save Settings',
      'Are you sure you want to save these settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            console.log('Saving settings:', settings);
            Alert.alert('Success', 'Settings saved successfully!');
          }
        }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            console.log('Resetting settings to defaults');
            Alert.alert('Success', 'Settings reset to defaults!');
          }
        }
      ]
    );
  };

  const renderSettingItem = (item: SettingItem, sectionIndex: number) => {
    return (
      <View key={item.id} style={{
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineVariant,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Typography variant="titleMedium" color="onSurface">
              {item.title}
            </Typography>
            <Typography variant="bodyMedium" color="onSurfaceVariant">
              {item.description}
            </Typography>
          </View>

          <View style={{ marginLeft: 16 }}>
            {item.type === 'toggle' ? (
              <Switch
                value={settings[item.id as keyof typeof settings] as boolean}
                onValueChange={(value) => handleSettingChange(sectionIndex, item.id, value)}
                trackColor={{ false: colors.outline, true: colors.primary }}
                thumbColor={settings[item.id as keyof typeof settings] ? colors.onPrimary : colors.onSurfaceVariant}
              />
            ) : item.type === 'input' ? (
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: colors.outline,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  minWidth: 120,
                  fontSize: 14,
                  color: colors.onSurface,
                  backgroundColor: colors.surfaceVariant,
                }}
                value={settings[item.id as keyof typeof settings] as string}
                onChangeText={(value) => handleSettingChange(sectionIndex, item.id, value)}
                placeholder="Enter value..."
                placeholderTextColor={colors.onSurfaceVariant}
              />
            ) : item.type === 'button' ? (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                }}
                onPress={() => console.log('Button pressed:', item.id)}
              >
                <Typography variant="labelMedium" color="onPrimary">
                  Action
                </Typography>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <Typography variant="headlineMedium" color="onBackground">
          Settings & Configuration
        </Typography>
        <Typography variant="bodyLarge" color="onSurfaceVariant">
          Configure platform settings, security, and system preferences
        </Typography>
      </View>

      {/* Settings Sections */}
      {settingSections.map((section, sectionIndex) => (
        <ElevatedCard key={sectionIndex} style={{ marginBottom: 24, padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.primaryContainer,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}>
              <Icon
                name={section.icon as any}
                size={24}
                color={colors.onPrimaryContainer}
              />
            </View>
            <View>
              <Typography variant="titleLarge" color="onSurface">
                {section.title}
              </Typography>
              <Typography variant="bodyMedium" color="onSurfaceVariant">
                {section.description}
              </Typography>
            </View>
          </View>

          {section.settings.map((setting) => renderSettingItem(setting, sectionIndex))}
        </ElevatedCard>
      ))}

      {/* Action Buttons */}
      <ElevatedCard style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: colors.primary,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={handleSaveSettings}
          >
            <Typography variant="labelLarge" color="onPrimary">
              Save Settings
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              backgroundColor: colors.error,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={handleResetSettings}
          >
            <Typography variant="labelLarge" color="onError">
              Reset to Defaults
            </Typography>
          </TouchableOpacity>
        </View>
      </ElevatedCard>
    </ScrollView>
  );
};