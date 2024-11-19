import { Stack } from 'expo-router';

import { OnboardingProvider } from '../../providers/Auth/OnboardingProvider';

const OnboardingLayout = () => {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerShown: false,
          headerTransparent: true,
        }}
      />
    </OnboardingProvider>
  );
};

export default OnboardingLayout;
