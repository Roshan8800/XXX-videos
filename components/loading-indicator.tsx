import React from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';
import { useTheme } from '../shared/utils/theme-context';
import { Typography } from '../shared/utils/typography';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export const PlayNiteLoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  size = 'large',
  fullScreen = false,
}) => {
  const { colors } = useTheme();

  const containerStyle: ViewStyle = fullScreen ? {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  } : {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View style={containerStyle}>
      <ActivityIndicator
        size={size}
        color={colors.primary}
      />
      {message && (
        <Typography
          variant="bodyMedium"
          color="onSurfaceVariant"
          style={{ marginTop: 16, textAlign: 'center' }}
        >
          {message}
        </Typography>
      )}
    </View>
  );
};