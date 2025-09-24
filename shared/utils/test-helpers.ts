// PlayNite Test Helpers
// Simple testing utilities that work without external dependencies

// Mock data factories
export const createMockUser = (overrides: any = {}) => ({
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

export const createMockVideo = (overrides: any = {}) => ({
  id: 'video-1',
  title: 'Test Video',
  description: 'This is a test video description',
  duration: 3600,
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

// Mock React Native components
export const mockTouchableOpacity = (props: any) => {
  const { onPress, children, style, disabled, ...rest } = props;
  return {
    type: 'TouchableOpacity',
    props: { onPress, style, disabled, ...rest },
    children,
  };
};

export const mockTextInput = (props: any) => {
  const { value, onChangeText, placeholder, style, ...rest } = props;
  return {
    type: 'TextInput',
    props: { value, onChangeText, placeholder, style, ...rest },
  };
};

export const mockView = (props: any) => {
  const { style, children, ...rest } = props;
  return {
    type: 'View',
    props: { style, ...rest },
    children,
  };
};

// Test assertion helpers
export const expectToBeCalledWith = (mockFn: jest.Mock, ...args: any[]) => {
  expect(mockFn).toHaveBeenCalledWith(...args);
};

export const expectToBeCalled = (mockFn: jest.Mock) => {
  expect(mockFn).toHaveBeenCalled();
};

export const expectNotToBeCalled = (mockFn: jest.Mock) => {
  expect(mockFn).not.toHaveBeenCalled();
};

// Form validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Theme testing helpers
export const getThemeColors = (isDark: boolean = false) => ({
  primary: '#d41173',
  background: isDark ? '#221019' : '#fffbff',
  surface: isDark ? '#221019' : '#fffbff',
  onBackground: isDark ? '#eadfe5' : '#1f1a1d',
  onSurface: isDark ? '#eadfe5' : '#1f1a1d',
  error: '#ba1a1a',
  onError: '#ffffff',
});

// Performance testing helpers
export const measureExecutionTime = async (fn: () => Promise<any> | any): Promise<number> => {
  const start = Date.now();
  await fn();
  const end = Date.now();
  return end - start;
};

export const expectToBeFast = async (fn: () => Promise<any> | any, maxTime: number = 100) => {
  const executionTime = await measureExecutionTime(fn);
  expect(executionTime).toBeLessThan(maxTime);
};

// Accessibility testing helpers
export const checkAccessibilityProps = (component: any) => {
  const props = component.props || {};

  if (props.accessible !== undefined) {
    expect(typeof props.accessible).toBe('boolean');
  }

  if (props.accessibilityLabel) {
    expect(typeof props.accessibilityLabel).toBe('string');
    expect(props.accessibilityLabel.length).toBeGreaterThan(0);
  }

  if (props.accessibilityHint) {
    expect(typeof props.accessibilityHint).toBe('string');
  }

  if (props.accessibilityRole) {
    expect(typeof props.accessibilityRole).toBe('string');
  }
};

// Component testing helpers
export const createComponentTester = (Component: any) => {
  return {
    render: (props: any = {}) => {
      return Component({ ...props });
    },

    expectToHaveStyle: (rendered: any, expectedStyle: any) => {
      const style = rendered.props?.style || {};
      Object.keys(expectedStyle).forEach(key => {
        if (expectedStyle[key] !== style[key]) {
          throw new Error(`Expected style ${key}: ${expectedStyle[key]}, got: ${style[key]}`);
        }
      });
    },

    expectToHaveText: (rendered: any, expectedText: string) => {
      const text = rendered.props?.children || '';
      if (typeof text === 'string') {
        expect(text).toBe(expectedText);
      } else if (Array.isArray(text)) {
        const textContent = text.join('');
        expect(textContent).toBe(expectedText);
      }
    },
  };
};