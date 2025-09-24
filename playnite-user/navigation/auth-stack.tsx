import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../shared/utils/theme-context';

export const AuthStack: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: 'Sign Up',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          title: 'Welcome',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
};