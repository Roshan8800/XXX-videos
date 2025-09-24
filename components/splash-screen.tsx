import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Icon } from '../shared/utils/icons';
import { useTheme } from '../shared/utils/theme-context';
import { Typography } from '../shared/utils/typography';

export const PlayNiteSplashScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* PlayNite Logo */}
      <View style={{
        alignItems: 'center',
        marginBottom: 48,
      }}>
        <Icon
          name="playnite_logo"
          size={120}
          color={colors.onPrimary}
        />
        <Typography
          variant="displayLarge"
          color="onPrimary"
          style={{ marginTop: 16 }}
        >
          PlayNite
        </Typography>
        <Typography
          variant="bodyLarge"
          color="onPrimary"
          style={{ marginTop: 8, opacity: 0.8 }}
        >
          Your Premium Entertainment Experience
        </Typography>
      </View>

      {/* Loading Indicator */}
      <View style={{
        alignItems: 'center',
      }}>
        <ActivityIndicator
          size="large"
          color={colors.onPrimary}
        />
        <Typography
          variant="bodyMedium"
          color="onPrimary"
          style={{ marginTop: 16, opacity: 0.7 }}
        >
          Loading...
        </Typography>
      </View>
    </View>
  );
};