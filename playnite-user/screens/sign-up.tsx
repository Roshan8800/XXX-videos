import React from 'react';
import { ScrollView, View, TextInput, Alert } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton, TextButton } from '../../shared/components/button';
import { AuthUtils, FirestoreUtils } from '../../shared/utils/firebase-utils';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
}

export const SignUpScreen: React.FC = () => {
  const { colors } = useTheme();
  const [formData, setFormData] = React.useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Create Firebase Auth user
      const userCredential = await AuthUtils.signUp(formData.email, formData.password);

      // Create user profile in Firestore
      const userProfile = {
        uid: userCredential.user.uid,
        username: formData.username,
        email: formData.email,
        displayName: formData.username,
        createdAt: new Date(),
        isProfileComplete: false,
        preferences: {
          notifications: true,
          autoplay: true,
          quality: 'high',
          theme: 'dark'
        },
        stats: {
          videosWatched: 0,
          totalWatchTime: 0,
          favoriteCategories: []
        }
      };

      await FirestoreUtils.setDocument('users', userCredential.user.uid, userProfile);

      // Update the user's display name in Firebase Auth
      await AuthUtils.updateUserProfile({ displayName: formData.username });

      Alert.alert(
        'Account Created!',
        'Welcome to PlayNite! Your account has been successfully created.',
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate to onboarding or home screen
              console.log('Navigate to onboarding');
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Sign up error:', error);

      let errorMessage = 'Failed to create account. Please try again.';

      // Handle specific Firebase Auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title="Create Account"
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
              <Icon name="person" size={40} color={colors.onPrimary} />
            </View>
            <Typography variant="headlineMedium" color="onBackground" align="center">
              Join PlayNite
            </Typography>
            <Typography variant="bodyLarge" color="onSurfaceVariant" align="center" style={{ marginTop: 8 }}>
              Create your account to access exclusive adult content
            </Typography>
          </View>

          {/* Form */}
          <ElevatedCard style={{ padding: 24 }}>
            <View style={{ gap: 20 }}>
              {/* Username Field */}
              <View>
                <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
                  Username *
                </Typography>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: errors.username ? colors.error : colors.outline,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    backgroundColor: colors.surfaceVariant,
                    color: colors.onSurface,
                  }}
                  placeholder="Choose a username"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.username && (
                  <Typography variant="bodySmall" color="error" style={{ marginTop: 4 }}>
                    {errors.username}
                  </Typography>
                )}
              </View>

              {/* Email Field */}
              <View>
                <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
                  Email Address *
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
                  placeholder="Enter your email"
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
                  }}
                  placeholder="Create a strong password"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                />
                {errors.password && (
                  <Typography variant="bodySmall" color="error" style={{ marginTop: 4 }}>
                    {errors.password}
                  </Typography>
                )}
                <Typography variant="bodySmall" color="onSurfaceVariant" style={{ marginTop: 4 }}>
                  Must be 8+ characters with uppercase, lowercase, number, and special character
                </Typography>
              </View>

              {/* Confirm Password Field */}
              <View>
                <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
                  Confirm Password *
                </Typography>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: errors.confirmPassword ? colors.error : colors.outline,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    backgroundColor: colors.surfaceVariant,
                    color: colors.onSurface,
                  }}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry
                />
                {errors.confirmPassword && (
                  <Typography variant="bodySmall" color="error" style={{ marginTop: 4 }}>
                    {errors.confirmPassword}
                  </Typography>
                )}
              </View>

              {/* Terms and Conditions */}
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <View style={{
                  width: 20,
                  height: 20,
                  borderWidth: 2,
                  borderColor: errors.acceptTerms ? colors.error : colors.outline,
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 2,
                }}>
                  {formData.acceptTerms && (
                    <Icon name="check_circle" size={14} color={colors.primary} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Typography variant="bodyMedium" color="onSurface">
                    I agree to the{' '}
                    <Typography
                      variant="bodyMedium"
                      color="primary"
                      style={{ textDecorationLine: 'underline' }}
                      onPress={() => console.log('Terms pressed')}
                    >
                      Terms of Service
                    </Typography>
                    {' '}and{' '}
                    <Typography
                      variant="bodyMedium"
                      color="primary"
                      style={{ textDecorationLine: 'underline' }}
                      onPress={() => console.log('Privacy pressed')}
                    >
                      Privacy Policy
                    </Typography>
                  </Typography>
                  {errors.acceptTerms && (
                    <Typography variant="bodySmall" color="error" style={{ marginTop: 4 }}>
                      {errors.acceptTerms}
                    </Typography>
                  )}
                </View>
              </View>

              {/* Sign Up Button */}
              <PrimaryButton
                onPress={handleSignUp}
                disabled={isLoading}
                style={{ marginTop: 16 }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </PrimaryButton>

              {/* Social Login Options */}
              <View style={{ alignItems: 'center', marginTop: 24 }}>
                <Typography variant="bodyMedium" color="onSurfaceVariant" style={{ marginBottom: 16 }}>
                  Or continue with
                </Typography>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <TextButton
                    onPress={() => console.log('Google sign up - TODO: Implement Google Auth')}
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
                    onPress={() => console.log('Facebook sign up - TODO: Implement Facebook Auth')}
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

              {/* Already have account */}
              <View style={{ alignItems: 'center', marginTop: 16 }}>
                <Typography variant="bodyMedium" color="onSurfaceVariant">
                  Already have an account?{' '}
                  <Typography
                    variant="bodyMedium"
                    color="primary"
                    style={{ textDecorationLine: 'underline' }}
                    onPress={() => console.log('Navigate to login')}
                  >
                    Sign In
                  </Typography>
                </Typography>
              </View>
            </View>
          </ElevatedCard>
        </View>
      </ScrollView>
    </View>
  );
};