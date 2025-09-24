import { Stack } from 'expo-router';
import { useNavigation } from '../../shared/utils/navigation-context';
import { AuthStack } from '../../playnite-user/navigation/auth-stack';
import { UserLayout } from '../../playnite-user/navigation/user-layout';

export default function UserLayoutWrapper() {
  const { currentState } = useNavigation();

  if (currentState === 'unauthenticated') {
    return <AuthStack />;
  }

  if (currentState === 'onboarding') {
    return (
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    );
  }

  // Default to user layout for authenticated state
  return <UserLayout />;
}