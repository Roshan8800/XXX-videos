import { render, RenderOptions } from '@testing-library/react-native';
import React, { ReactElement } from 'react';
import { ThemeProvider } from './theme-context';

// Mock expo-constants
jest.mock('expo-constants', () => ({
  Constants: {
    manifest: {
      version: '1.0.0',
    },
  },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  loadAsync: jest.fn(() => Promise.resolve()),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return {
    ...Reanimated,
    useAnimatedStyle: () => ({}),
    useSharedValue: () => ({ value: 0 }),
    useAnimatedScrollHandler: () => ({}),
    useAnimatedRef: () => React.createRef(),
    useDerivedValue: () => ({ value: 0 }),
    useAnimatedGestureHandler: () => ({}),
    runOnJS: (fn: any) => fn,
    runOnUI: (fn: any) => fn,
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

// Custom render function with theme provider
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider initialTheme="light">
        {children}
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  isVerified: true,
  createdAt: new Date().toISOString(),
  preferences: {
    theme: 'light',
    notifications: true,
    autoplay: false,
  },
  ...overrides,
});

export const createMockVideo = (overrides = {}) => ({
  id: 'video-1',
  title: 'Test Video',
  description: 'This is a test video description',
  duration: 3600, // 1 hour in seconds
  thumbnail: 'https://example.com/thumbnail.jpg',
  videoUrl: 'https://example.com/video.mp4',
  category: 'entertainment',
  tags: ['test', 'video'],
  views: 1000,
  likes: 50,
  dislikes: 5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  canGoBack: jest.fn(() => true),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(() => ({ index: 0, routes: [] })),
});

// Helper to create mock props
export const createMockProps = (componentName: string, overrides = {}) => {
  const baseProps = {
    testID: `${componentName}-test`,
    accessibilityLabel: `${componentName} component`,
    accessible: true,
  };

  return { ...baseProps, ...overrides };
};

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Helper to create mock event handlers
export const createMockEventHandler = () => jest.fn();

// Helper to create mock styles
export const createMockStyle = (overrides = {}) => ({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    ...overrides,
  },
});

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };
