import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from './theme-context';

export type IconName =
  // Navigation icons
  | 'home'
  | 'dashboard'
  | 'menu'
  | 'close'
  | 'arrow_back'
  | 'arrow_forward'
  | 'chevron_left'
  | 'chevron_right'
  | 'expand_more'
  | 'expand_less'

  // Action icons
  | 'search'
  | 'favorite'
  | 'favorite_border'
  | 'bookmark'
  | 'bookmark_border'
  | 'share'
  | 'download'
  | 'upload'
  | 'edit'
  | 'delete'
  | 'add'
  | 'remove'
  | 'settings'
  | 'more_vert'
  | 'more_horiz'

  // Media icons
  | 'play_circle'
  | 'pause_circle'
  | 'play_arrow'
  | 'pause'
  | 'skip_next'
  | 'skip_previous'
  | 'volume_up'
  | 'volume_down'
  | 'volume_mute'
  | 'movie'
  | 'video_library'
  | 'image'
  | 'photo'

  // User interface icons
  | 'person'
  | 'account_circle'
  | 'notifications'
  | 'notifications_none'
  | 'mail'
  | 'email'
  | 'phone'
  | 'chat'
  | 'message'

  // Content icons
  | 'category'
  | 'tag'
  | 'star'
  | 'star_border'
  | 'thumb_up'
  | 'thumb_down'
  | 'visibility'
  | 'visibility_off'

  // Admin icons
  | 'admin_panel_settings'
  | 'analytics'
  | 'trending_up'
  | 'people'
  | 'group'
  | 'supervisor_account'
  | 'security'
  | 'lock'
  | 'lock_open'
  | 'key'
  | 'vpn_key'

  // Status icons
  | 'check_circle'
  | 'error'
  | 'warning'
  | 'info'
  | 'help'
  | 'help_outline'

  // Common symbols
  | 'filter_list'
  | 'sort'
  | 'refresh'
  | 'sync'
  | 'backup'
  | 'restore'
  | 'archive'
  | 'unarchive'
  | 'folder'
  | 'folder_open'

  // PlayNite Brand icons
  | 'playnite_logo'
  | 'playnite_symbol';

interface IconProps extends TextProps {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: -25 | 0 | 200;
  opticalSize?: 20 | 24 | 40 | 48;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  filled = false,
  weight = 400,
  grade = 0,
  opticalSize = 24,
  style,
  ...props
}) => {
  const { colors, isDark } = useTheme();

  const iconColor = color || colors.onSurface;

  // For React Native, we'll use a simpler approach with font weight
  // In a real implementation, you might need to use a custom font or library
  const fontWeight = weight >= 500 ? 'bold' : weight >= 400 ? 'normal' : '300';

  return (
    <Text
      style={[
        {
          fontFamily: 'Material Symbols Outlined',
          fontSize: size,
          color: iconColor,
          fontWeight,
          // Note: fontVariationSettings is not supported in React Native Text
          // You would need to use a custom font file or library for full support
        },
        style,
      ]}
      {...props}
    >
      {name}
    </Text>
  );
};

// Icon size presets
export const IconSizes = {
  small: 16,
  medium: 24,
  large: 32,
  xlarge: 48,
} as const;

// Icon weight presets
export const IconWeights = {
  thin: 100,
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700,
} as const;

// Common icon combinations
export const Icons = {
  // Navigation
  Home: (props: Omit<IconProps, 'name'>) => <Icon name="home" {...props} />,
  Dashboard: (props: Omit<IconProps, 'name'>) => <Icon name="dashboard" {...props} />,
  Menu: (props: Omit<IconProps, 'name'>) => <Icon name="menu" {...props} />,
  Back: (props: Omit<IconProps, 'name'>) => <Icon name="arrow_back" {...props} />,
  Close: (props: Omit<IconProps, 'name'>) => <Icon name="close" {...props} />,

  // Actions
  Search: (props: Omit<IconProps, 'name'>) => <Icon name="search" {...props} />,
  Settings: (props: Omit<IconProps, 'name'>) => <Icon name="settings" {...props} />,
  Add: (props: Omit<IconProps, 'name'>) => <Icon name="add" {...props} />,
  Edit: (props: Omit<IconProps, 'name'>) => <Icon name="edit" {...props} />,
  Delete: (props: Omit<IconProps, 'name'>) => <Icon name="delete" {...props} />,

  // Media
  Play: (props: Omit<IconProps, 'name'>) => <Icon name="play_circle" {...props} />,
  Movie: (props: Omit<IconProps, 'name'>) => <Icon name="movie" {...props} />,

  // User
  User: (props: Omit<IconProps, 'name'>) => <Icon name="person" {...props} />,
  Notifications: (props: Omit<IconProps, 'name'>) => <Icon name="notifications" {...props} />,

  // Status
  Check: (props: Omit<IconProps, 'name'>) => <Icon name="check_circle" {...props} />,
  Error: (props: Omit<IconProps, 'name'>) => <Icon name="error" {...props} />,
  Warning: (props: Omit<IconProps, 'name'>) => <Icon name="warning" {...props} />,
  Info: (props: Omit<IconProps, 'name'>) => <Icon name="info" {...props} />,

  // PlayNite Brand
  PlayNiteLogo: (props: Omit<IconProps, 'name'>) => <Icon name="playnite_logo" {...props} />,
  PlayNiteSymbol: (props: Omit<IconProps, 'name'>) => <Icon name="playnite_symbol" {...props} />,
} as const;