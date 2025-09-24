import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '../utils/theme-context';
import { Typography } from '../utils/typography';
import { Card, ElevatedCard } from './index';
import { Icon } from '../utils/icons';
import { PrimaryButton } from './button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.retry} />;
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.retry} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
}

export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => {
  const { colors } = useTheme();

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <ElevatedCard style={{ padding: 24, alignItems: 'center', maxWidth: 400 }}>
        <View style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.error + '20',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Icon name="error" size={32} color={colors.error} />
        </View>

        <Typography variant="headlineSmall" color="onSurface" style={{ marginBottom: 8, textAlign: 'center' }}>
          Something went wrong
        </Typography>

        <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginBottom: 24, textAlign: 'center' }}>
          An unexpected error occurred. Please try again.
        </Typography>

        <PrimaryButton onPress={retry} style={{ minWidth: 120 }}>
          Try Again
        </PrimaryButton>
      </ElevatedCard>
    </View>
  );
};