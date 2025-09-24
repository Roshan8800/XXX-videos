import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserScreen } from '../../playnite-user/navigation/user-layout';

export type NavigationState = 'authenticated' | 'unauthenticated' | 'onboarding';

interface NavigationContextType {
  currentState: NavigationState;
  currentUserScreen: UserScreen;
  setNavigationState: (state: NavigationState) => void;
  setCurrentUserScreen: (screen: UserScreen) => void;
  navigateToUserScreen: (screen: UserScreen) => void;
  navigateToAuth: () => void;
  navigateToOnboarding: () => void;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  initialState?: NavigationState;
  initialUserScreen?: UserScreen;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  initialState = 'unauthenticated',
  initialUserScreen = 'home',
}) => {
  const [currentState, setCurrentState] = useState<NavigationState>(initialState);
  const [currentUserScreen, setCurrentUserScreen] = useState<UserScreen>(initialUserScreen);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const setNavigationState = (state: NavigationState) => {
    setCurrentState(state);
  };

  const navigateToUserScreen = (screen: UserScreen) => {
    setCurrentUserScreen(screen);
    setCurrentState('authenticated');
  };

  const navigateToAuth = () => {
    setCurrentState('unauthenticated');
  };

  const navigateToOnboarding = () => {
    setCurrentState('onboarding');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const value: NavigationContextType = {
    currentState,
    currentUserScreen,
    setNavigationState,
    setCurrentUserScreen,
    navigateToUserScreen,
    navigateToAuth,
    navigateToOnboarding,
    isDrawerOpen,
    setDrawerOpen,
    toggleDrawer,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};