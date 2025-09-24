# PlayNite - Adult Entertainment Platform

A modern, responsive adult entertainment platform built with React Native and Material Design 3, featuring separate admin and user panels with a shared design system.

## Project Structure

```
/
├── playnite-admin/          # Admin panel
│   ├── components/          # Admin-specific components
│   ├── screens/             # Admin screens (dashboard, user management, etc.)
│   ├── navigation/          # Admin navigation
│   ├── utils/               # Admin utilities
│   ├── types/               # Admin TypeScript types
│   └── assets/              # Admin assets
│
├── playnite-user/           # User panel
│   ├── components/          # User-specific components
│   ├── screens/             # User screens (homepage, video player, etc.)
│   ├── navigation/          # User navigation
│   ├── utils/               # User utilities
│   ├── types/               # User TypeScript types
│   └── assets/              # User assets
│
└── shared/                  # Shared components and utilities
    ├── components/          # Reusable UI components
    │   ├── button.tsx       # Material Design 3 buttons
    │   ├── card.tsx         # Material Design 3 cards
    │   ├── surface.tsx      # Material Design 3 surfaces
    │   ├── app-bar.tsx      # Material Design 3 app bars
    │   └── index.ts         # Component exports
    ├── utils/               # Shared utilities
    │   ├── theme-context.tsx # Theme provider and context
    │   ├── typography.tsx   # Typography utilities
    │   └── icons.tsx        # Material Symbols Outlined icons
    ├── constants/           # Shared constants
    │   └── theme.ts         # Material Design 3 theme configuration
    ├── types/               # Shared TypeScript types
    ├── styles/              # Shared styles
    └── assets/              # Shared assets
```

## Design System Features

### 🎨 Material Design 3
- Modern Material Design 3 components
- Elevation system with 6 levels
- Proper spacing and typography scales
- Accessible color contrasts

### 🌈 Pink/Magenta Theme
- Primary color: `#d41173` (PlayNite magenta)
- Comprehensive color palette for light and dark themes
- Semantic color tokens for consistent theming

### 📱 Responsive Design
- Mobile-first approach
- Flexible layouts that work on all screen sizes
- Touch-friendly interactive elements

### 🌙 Dark/Light Theme Support
- System theme detection
- Manual theme switching
- Smooth theme transitions
- Persistent theme preferences

### 🔤 Typography System
- Spline Sans font family
- Material Design 3 typography scale
- Proper line heights and letter spacing
- Responsive font sizes

### 🎯 Icon System
- Material Symbols Outlined icons
- Consistent icon sizing and colors
- Semantic icon usage
- Extensible icon library

## Key Components

### Shared Components

#### Button
```tsx
import { PrimaryButton, SecondaryButton, TextButton } from '../shared/components';

// Primary button (filled)
<PrimaryButton onPress={() => console.log('Pressed')}>
  Click Me
</PrimaryButton>

// Secondary button (outlined)
<SecondaryButton onPress={() => console.log('Pressed')}>
  Click Me
</SecondaryButton>

// Text button
<TextButton onPress={() => console.log('Pressed')}>
  Click Me
</TextButton>
```

#### Card
```tsx
import { Card, ElevatedCard, ClickableCard } from '../shared/components';

// Regular card
<Card>
  <Typography>Card content</Typography>
</Card>

// Elevated card
<ElevatedCard>
  <Typography>Important content</Typography>
</ElevatedCard>

// Clickable card
<ClickableCard onPress={() => console.log('Card pressed')}>
  <Typography>Clickable content</Typography>
</ClickableCard>
```

#### Typography
```tsx
import { Typography, HeadlineLarge, BodyMedium } from '../shared/utils/typography';

// Using Typography component
<Typography variant="headlineLarge" color="primary">
  Large Headline
</Typography>

// Using convenience components
<HeadlineLarge color="onSurface">
  Large Headline
</HeadlineLarge>

<BodyMedium color="onSurfaceVariant">
  Body text content
</BodyMedium>
```

#### Icons
```tsx
import { Icon, Icons } from '../shared/utils/icons';

// Using Icon component
<Icon name="home" size={24} color="#d41173" />

// Using convenience icons
<Icons.Home size={24} color="#d41173" />
<Icons.Search size={24} color="#d41173" />
<Icons.Settings size={24} color="#d41173" />
```

### Theme System

#### Using Theme Context
```tsx
import { useTheme } from '../shared/utils/theme-context';

const MyComponent = () => {
  const { colors, isDark, theme, setTheme } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Typography color="onBackground">
        Current theme: {theme}
      </Typography>
      <Typography color="onBackground">
        Is dark: {isDark ? 'Yes' : 'No'}
      </Typography>
    </View>
  );
};
```

#### Theme Provider
```tsx
import { ThemeProvider } from '../shared/utils/theme-context';

export const App = () => {
  return (
    <ThemeProvider initialTheme="system">
      <MyComponent />
    </ThemeProvider>
  );
};
```

## Admin Panel Features

### Dashboard
- Real-time statistics and metrics
- Recent activity feed
- Quick action buttons
- Responsive grid layout

### Key Screens
- **Dashboard**: Overview with stats and recent activity
- **Content Management**: Video and content administration
- **User Management**: User accounts and permissions
- **Analytics**: Detailed analytics and reporting

## User Panel Features

### Homepage
- Featured video carousel
- Trending videos section
- Categories grid
- Responsive video cards

### Key Screens
- **Homepage**: Main landing page with featured content
- **Video Player**: Full-screen video playback
- **Search**: Search functionality with filters
- **Categories**: Browse content by category
- **User Profile**: Account management and preferences

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up Theme Provider**
   Wrap your app with the ThemeProvider:
   ```tsx
   import { ThemeProvider } from './shared/utils/theme-context';

   export const App = () => {
     return (
       <ThemeProvider initialTheme="system">
         {/* Your app content */}
       </ThemeProvider>
     );
   };
   ```

3. **Import Components**
   ```tsx
   import {
     Button,
     Card,
     Typography,
     Icon
   } from './shared/components';
   ```

4. **Use Theme**
   ```tsx
   import { useTheme } from './shared/utils/theme-context';

   const MyComponent = () => {
     const { colors } = useTheme();

     return (
       <View style={{ backgroundColor: colors.background }}>
         <Typography color="onBackground">Hello World</Typography>
       </View>
     );
   };
   ```

## Customization

### Adding New Colors
Edit `shared/constants/theme.ts`:
```tsx
export const COLORS = {
  // Add your custom colors here
  customColor: '#your-color',
  // ... existing colors
} as const;
```

### Adding New Typography Variants
Edit `shared/constants/theme.ts`:
```tsx
export const TYPOGRAPHY = {
  // Add your custom typography here
  customVariant: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  // ... existing typography
} as const;
```

### Adding New Icons
Edit `shared/utils/icons.tsx`:
```tsx
export type IconName =
  | // ... existing icons
  | 'your_custom_icon';
```

## Performance Considerations

- Components are optimized for React Native performance
- Theme context uses React Context with proper memoization
- Icons use a single font file for optimal loading
- Typography system uses consistent font loading

## Accessibility

- All components follow Material Design accessibility guidelines
- Proper color contrasts for all theme combinations
- Touch targets meet minimum size requirements
- Screen reader support with semantic markup

## Browser Support

This project is designed for React Native mobile applications. For web support, additional configuration may be required for font loading and responsive breakpoints.

---

Built with ❤️ using Material Design 3 and modern React Native practices.