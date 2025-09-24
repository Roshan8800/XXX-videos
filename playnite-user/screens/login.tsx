import React from 'react';
import { ScrollView, View, TextInput, Alert } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, AppBar, PlayNiteLoadingIndicator, ErrorBoundary } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton, TextButton } from '../../shared/components/button';
import { AuthUtils } from '../../shared/utils/firebase-utils';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export const LoginScreen: React.FC = () => {
  const { colors } = useTheme();
  const [formData, setFormData] = React.useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = React.useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email or username is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email) && !/^[a-zA-Z0-9_]{3,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email or username';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof LoginFormErrors]: undefined }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Use Firebase Auth for login
      await AuthUtils.signIn(formData.email, formData.password);

      Alert.alert(
        'Welcome back!',
        'You have successfully logged in to PlayNite.',
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate to home screen
              console.log('Navigate to home');
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed. Please check your credentials and try again.';

      // Handle specific Firebase Auth errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address first.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      await AuthUtils.resetPassword(formData.email);
      Alert.alert(
        'Reset Link Sent',
        'We\'ve sent a password reset link to your email address. Please check your inbox and follow the instructions.',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Password reset email sent to:', formData.email);
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Password reset error:', error);

      let errorMessage = 'Failed to send reset email. Please try again.';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      Alert.alert('Error', errorMessage);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <PlayNiteLoadingIndicator
          message="Signing you in..."
          fullScreen={true}
        />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppBar
          title="Welcome Back"
          leadingIcon="arrow_back"
          onLeadingIconPress={() => console.log('Back pressed')}
          elevated={true}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Icon name="lock" size={40} color={colors.onPrimary} />
            </View>
            <Typography variant="headlineMedium" color="onBackground" align="center">
              Welcome Back
            </Typography>
            <Typography variant="bodyLarge" color="onSurfaceVariant" align="center" style={{ marginTop: 8 }}>
              Sign in to your PlayNite account to continue
            </Typography>
          </View>

          {/* Login Form */}
          <ElevatedCard style={{ padding: 24 }}>
            <View style={{ gap: 20 }}>
              {/* Email/Username Field */}
              <View>
                <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
                  Email or Username *
                </Typography>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: errors.email ? colors.error : colors.outline,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    backgroundColor: colors.surfaceVariant,
                    color: colors.onSurface,
                  }}
                  placeholder="Enter your email or username"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.email && (
                  <Typography variant="bodySmall" color="error" style={{ marginTop: 4 }}>
                    {errors.email}
                  </Typography>
                )}
              </View>

              {/* Password Field */}
              <View>
                <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
                  Password *
                </Typography>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: errors.password ? colors.error : colors.outline,
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 16,
                      backgroundColor: colors.surfaceVariant,
                      color: colors.onSurface,
                      paddingRight: 48,
                    }}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.onSurfaceVariant}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                  />
                  <View style={{
                    position: 'absolute',
                    right: 12,
                    top: 12,
                    padding: 4,
                  }}>
                    <Icon
                      name={showPassword ? "visibility_off" : "visibility"}
                      size={20}
                      color={colors.onSurfaceVariant}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  </View>
                </View>
                {errors.password && (
                  <Typography variant="bodySmall" color="error" style={{ marginTop: 4 }}>
                    {errors.password}
                  </Typography>
                )}
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{
                    width: 20,
                    height: 20,
                    borderWidth: 2,
                    borderColor: colors.outline,
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {formData.rememberMe && (
                      <Icon name="check_circle" size={14} color={colors.primary} />
                    )}
                  </View>
                  <TextButton onPress={() => handleInputChange('rememberMe', !formData.rememberMe)}>
                    <Typography variant="bodyMedium" color="onSurface">
                      Remember me
                    </Typography>
                  </TextButton>
                </View>

                <TextButton onPress={handleForgotPassword}>
                  <Typography variant="bodyMedium" color="primary">
                    Forgot password?
                  </Typography>
                </TextButton>
              </View>

              {/* Login Button */}
              <PrimaryButton
                onPress={handleLogin}
                disabled={isLoading}
                style={{ marginTop: 16 }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </PrimaryButton>

              {/* Social Login Options */}
              <View style={{ alignItems: 'center', marginTop: 24 }}>
                <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginBottom: 16 }}>
                  Or continue with
                </Typography>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <TextButton
                    onPress={() => console.log('Google login - TODO: Implement Google Auth')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      borderWidth: 1,
                      borderColor: colors.outline,
                      borderRadius: 12,
                    }}
                  >
                    <Icon name="mail" size={20} color={colors.onSurface} />
                    <Typography variant="labelLarge" color="onSurface">
                      Google
                    </Typography>
                  </TextButton>
                  <TextButton
                    onPress={() => console.log('Facebook login - TODO: Implement Facebook Auth')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      borderWidth: 1,
                      borderColor: colors.outline,
                      borderRadius: 12,
                    }}
                  >
                    <Icon name="share" size={20} color={colors.onSurface} />
                    <Typography variant="labelLarge" color="onSurface">
                      Facebook
                    </Typography>
                  </TextButton>
                </View>
              </View>

              {/* Sign Up Link */}
              <View style={{ alignItems: 'center', marginTop: 16 }}>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  Don't have an account?{' '}
                  <Typography
                    variant="bodyMedium"
                    color="primary"
                    style={{ textDecorationLine: 'underline' }}
                    onPress={() => console.log('Navigate to sign up')}
                  >
                    Create Account
                  </Typography>
                </Typography>
              </View>
            </View>
          </ElevatedCard>

          {/* Terms Notice */}
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <Typography variant="bodySmall" color="onSurfaceVariant" align="center">
              By signing in, you agree to our{' '}
              <Typography
                variant="bodySmall"
                color="primary"
                style={{ textDecorationLine: 'underline' }}
                onPress={() => console.log('Terms pressed')}
              >
                Terms of Service
              </Typography>
              {' '}and{' '}
              <Typography
                variant="bodySmall"
                color="primary"
                style={{ textDecorationLine: 'underline' }}
                onPress={() => console.log('Privacy pressed')}
              >
                Privacy Policy
              </Typography>
            </Typography>
          </View>
        </View>
      </ScrollView>
    </View>
    </ErrorBoundary>
  );
};