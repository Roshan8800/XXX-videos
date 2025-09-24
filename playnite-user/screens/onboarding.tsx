import React from 'react';
import { ScrollView, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '../../shared/utils/theme-context';
import { Typography } from '../../shared/utils/typography';
import { Card, ElevatedCard, AppBar } from '../../shared/components';
import { Icon } from '../../shared/utils/icons';
import { PrimaryButton, SecondaryButton, TextButton } from '../../shared/components/button';

type OnboardingStep = 'welcome' | 'age-verification' | 'preferences' | 'complete';

interface OnboardingData {
  dateOfBirth: string;
  ageConfirmed: boolean;
  contentSensitivity: 'all' | 'limited' | 'none';
  interests: string[];
  notifications: boolean;
}

interface OnboardingErrors {
  dateOfBirth?: string;
  ageConfirmed?: string;
}

export const OnboardingScreen: React.FC = () => {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = React.useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = React.useState<OnboardingData>({
    dateOfBirth: '',
    ageConfirmed: false,
    contentSensitivity: 'limited',
    interests: [],
    notifications: true,
  });
  const [errors, setErrors] = React.useState<OnboardingErrors>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const validateAgeVerification = (): boolean => {
    const newErrors: OnboardingErrors = {};

    if (!onboardingData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(onboardingData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old to use PlayNite';
      }
    }

    if (!onboardingData.ageConfirmed) {
      newErrors.ageConfirmed = 'You must confirm you are 18+ years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof OnboardingData, value: string | boolean | string[]) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof OnboardingErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof OnboardingErrors]: undefined }));
    }
  };

  const handleNext = async () => {
    if (currentStep === 'age-verification' && !validateAgeVerification()) {
      return;
    }

    if (currentStep === 'complete') {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        Alert.alert(
          'Welcome to PlayNite!',
          'Your onboarding is complete. Enjoy your personalized experience!',
          [
            {
              text: 'Get Started',
              onPress: () => {
                // Navigate to home screen
                console.log('Navigate to home');
              }
            }
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const steps: OnboardingStep[] = ['welcome', 'age-verification', 'preferences', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: OnboardingStep[] = ['welcome', 'age-verification', 'preferences', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const toggleInterest = (interest: string) => {
    setOnboardingData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const renderWelcomeStep = () => (
    <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
      <View style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
      }}>
        <Icon name="movie" size={60} color={colors.onPrimary} />
      </View>

      <Typography variant="headlineLarge" color="onBackground" align="center" style={{ marginBottom: 16 }}>
        Welcome to PlayNite
      </Typography>

      <Typography variant="bodyLarge" color="onSurfaceVariant" align="center" style={{ marginBottom: 32 }}>
        Your premium destination for adult entertainment. Let's set up your personalized experience.
      </Typography>

      <View style={{ gap: 16, marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="check_circle" size={24} color={colors.primary} />
          <Typography variant="bodyLarge" color="onSurface">
            Age verification for safety
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="check_circle" size={24} color={colors.primary} />
          <Typography variant="bodyLarge" color="onSurface">
            Personalized content recommendations
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="check_circle" size={24} color={colors.primary} />
          <Typography variant="bodyLarge" color="onSurface">
            Privacy and security first
          </Typography>
        </View>
      </View>
    </View>
  );

  const renderAgeVerificationStep = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
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
          <Icon name="security" size={40} color={colors.onPrimary} />
        </View>
        <Typography variant="headlineSmall" color="onBackground" align="center">
          Age Verification
        </Typography>
        <Typography variant="bodyMedium" color="onSurfaceVariant" align="center" style={{ marginTop: 8 }}>
          To ensure a safe and appropriate experience, we need to verify your age.
        </Typography>
      </View>

      <ElevatedCard style={{ padding: 24, marginBottom: 24 }}>
        <View style={{ gap: 20 }}>
          {/* Date of Birth */}
          <View>
            <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 8 }}>
              Date of Birth *
            </Typography>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: errors.dateOfBirth ? colors.error : colors.outline,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                backgroundColor: colors.surfaceVariant,
                color: colors.onSurface,
              }}
              placeholder="MM / DD / YYYY"
              placeholderTextColor={colors.onSurfaceVariant}
              value={onboardingData.dateOfBirth}
              onChangeText={(value) => handleInputChange('dateOfBirth', value)}
            />
            {errors.dateOfBirth && (
              <Typography variant="bodySmall" color="error" style={{ marginTop: 4 }}>
                {errors.dateOfBirth}
              </Typography>
            )}
          </View>

          {/* Age Confirmation */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <View style={{
              width: 20,
              height: 20,
              borderWidth: 2,
              borderColor: errors.ageConfirmed ? colors.error : colors.outline,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 2,
            }}>
              {onboardingData.ageConfirmed && (
                <Icon name="check_circle" size={14} color={colors.primary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Typography variant="bodyMedium" color="onSurface">
                I confirm that I am at least 18 years old and agree to the{' '}
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
              {errors.ageConfirmed && (
                <Typography variant="bodySmall" color="error" style={{ marginTop: 4 }}>
                  {errors.ageConfirmed}
                </Typography>
              )}
            </View>
          </View>
        </View>
      </ElevatedCard>
    </ScrollView>
  );

  const renderPreferencesStep = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
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
          <Icon name="settings" size={40} color={colors.onPrimary} />
        </View>
        <Typography variant="headlineSmall" color="onBackground" align="center">
          Content Preferences
        </Typography>
        <Typography variant="bodyMedium" color="onSurfaceVariant" align="center" style={{ marginTop: 8 }}>
          Help us personalize your experience by selecting your preferences.
        </Typography>
      </View>

      <ElevatedCard style={{ padding: 24, marginBottom: 24 }}>
        <View style={{ gap: 24 }}>
          {/* Content Sensitivity */}
          <View>
            <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 16 }}>
              Content Sensitivity
            </Typography>
            <View style={{ gap: 12 }}>
              {[
                { value: 'all', label: 'Show all content', description: 'Access to all available content types' },
                { value: 'limited', label: 'Limit content to general categories', description: 'Filtered content with some restrictions' },
                { value: 'none', label: 'Minimal restrictions', description: 'Most permissive content access' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleInputChange('contentSensitivity', option.value as any)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: onboardingData.contentSensitivity === option.value ? colors.primary : colors.outline,
                    borderRadius: 12,
                    backgroundColor: onboardingData.contentSensitivity === option.value ? colors.primary + '10' : 'transparent',
                  }}
                >
                  <View style={{
                    width: 20,
                    height: 20,
                    borderWidth: 2,
                    borderColor: onboardingData.contentSensitivity === option.value ? colors.primary : colors.outline,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {onboardingData.contentSensitivity === option.value && (
                      <View style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: colors.primary,
                      }} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Typography variant="bodyLarge" color="onSurface">
                      {option.label}
                    </Typography>
                    <Typography variant="bodySmall" color="onSurfaceVariant">
                      {option.description}
                    </Typography>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Interests */}
          <View>
            <Typography variant="labelLarge" color="onSurface" style={{ marginBottom: 16 }}>
              Content Interests (Optional)
            </Typography>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[
                'Amateur', 'Professional', 'Fetish', 'BDSM', 'Roleplay',
                'Lesbian', 'Gay', 'Transgender', 'Mature', 'Teen'
              ].map((interest) => (
                <TouchableOpacity
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: onboardingData.interests.includes(interest) ? colors.primary : colors.outline,
                    borderRadius: 20,
                    backgroundColor: onboardingData.interests.includes(interest) ? colors.primary + '10' : 'transparent',
                  }}
                >
                  <Typography
                    variant="bodyMedium"
                    color={onboardingData.interests.includes(interest) ? 'primary' : 'onSurface'}
                  >
                    {interest}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notifications */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Typography variant="bodyLarge" color="onSurface">
                Push Notifications
              </Typography>
              <Typography variant="bodySmall" color="onSurfaceVariant">
                Receive updates about new content and features
              </Typography>
            </View>
            <TouchableOpacity
              onPress={() => handleInputChange('notifications', !onboardingData.notifications)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                backgroundColor: onboardingData.notifications ? colors.primary : colors.surfaceVariant,
                justifyContent: 'center',
                alignItems: onboardingData.notifications ? 'flex-end' : 'flex-start',
                paddingHorizontal: 2,
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: colors.onPrimary,
              }} />
            </TouchableOpacity>
          </View>
        </View>
      </ElevatedCard>
    </ScrollView>
  );

  const renderCompleteStep = () => (
    <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
      <View style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
      }}>
        <Icon name="check_circle" size={60} color={colors.onPrimary} />
      </View>

      <Typography variant="headlineLarge" color="onBackground" align="center" style={{ marginBottom: 16 }}>
        You're All Set!
      </Typography>

      <Typography variant="bodyLarge" color="onSurfaceVariant" align="center" style={{ marginBottom: 32 }}>
        Your PlayNite experience is now personalized and ready. Enjoy unlimited access to premium adult content.
      </Typography>

      <View style={{ gap: 16, marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="star" size={24} color={colors.primary} />
          <Typography variant="bodyLarge" color="onSurface">
            Premium content access
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="download" size={24} color={colors.primary} />
          <Typography variant="bodyLarge" color="onSurface">
            Offline viewing available
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="security" size={24} color={colors.primary} />
          <Typography variant="bodyLarge" color="onSurface">
            Privacy protected
          </Typography>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'age-verification':
        return renderAgeVerificationStep();
      case 'preferences':
        return renderPreferencesStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderWelcomeStep();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'welcome':
        return 'Welcome';
      case 'age-verification':
        return 'Age Verification';
      case 'preferences':
        return 'Preferences';
      case 'complete':
        return 'Complete';
      default:
        return 'Welcome';
    }
  };

  const getProgress = () => {
    const steps = ['welcome', 'age-verification', 'preferences', 'complete'];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppBar
        title={getStepTitle()}
        leadingIcon={currentStep === 'welcome' ? undefined : 'arrow_back'}
        onLeadingIconPress={currentStep === 'welcome' ? undefined : handleBack}
        elevated={true}
      />

      {/* Progress Bar */}
      {currentStep !== 'welcome' && (
        <View style={{
          height: 4,
          backgroundColor: colors.surfaceVariant,
          marginHorizontal: 16,
          borderRadius: 2,
        }}>
          <View style={{
            height: '100%',
            width: `${getProgress()}%`,
            backgroundColor: colors.primary,
            borderRadius: 2,
          }} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        {renderCurrentStep()}
      </View>

      {/* Bottom Actions */}
      <View style={{
        padding: 16,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.outlineVariant,
      }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {currentStep === 'complete' ? (
            <PrimaryButton
              onPress={handleNext}
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading ? 'Setting up...' : 'Get Started'}
            </PrimaryButton>
          ) : (
            <>
              <SecondaryButton
                onPress={handleBack}
                disabled={currentStep === 'welcome'}
                style={{ flex: 1 }}
              >
                Back
              </SecondaryButton>
              <PrimaryButton
                onPress={handleNext}
                style={{ flex: 1 }}
              >
                {currentStep === 'preferences' ? 'Complete Setup' : 'Continue'}
              </PrimaryButton>
            </>
          )}
        </View>
      </View>
    </View>
  );
};