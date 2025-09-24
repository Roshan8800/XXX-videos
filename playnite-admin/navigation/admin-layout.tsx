import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { AdminNavigation, AdminScreen } from './admin-navigation';
import { AdminDashboard } from '../screens/dashboard';
import { ContentManagement } from '../screens/content-management';
import { UserManagement } from '../screens/user-management';
import { AnalyticsDashboard } from '../screens/analytics-dashboard';
import { ContentModeration } from '../screens/content-moderation';
import { RevenueManagement } from '../screens/revenue-management';
import { SettingsPanel } from '../screens/settings-panel';
import { NotificationsManagement } from '../screens/notifications-management';

interface AdminLayoutProps {
  initialScreen?: AdminScreen;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  initialScreen = 'dashboard',
}) => {
  const { colors } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>(initialScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'content-management':
        return <ContentManagement />;
      case 'user-management':
        return <UserManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'content-moderation':
        return <ContentModeration />;
      case 'revenue-management':
        return <RevenueManagement />;
      case 'settings':
        return <SettingsPanel />;
      case 'notifications':
        return <NotificationsManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Navigation Sidebar */}
      <AdminNavigation
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
      />

      {/* Main Content Area */}
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});