import '../../global.css';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ExpoSecureStoreClerkAdapter } from '../../utils/auth/auth-service';
import { SessionProvider } from '../providers/Auth/SessionProvider';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Raleway: require('../../assets/fonts/Raleway-Regular.ttf'),
    RalewayBold: require('../../assets/fonts/Raleway-Bold.ttf'),
    RalewayItalic: require('../../assets/fonts/Raleway-Italic.ttf'),
    RalewayBoldItalic: require('../../assets/fonts/Raleway-BoldItalic.ttf'),
    RalewayExtraBold: require('../../assets/fonts/Raleway-ExtraBold.ttf'),
    RalewayExtraBoldItalic: require('../../assets/fonts/Raleway-ExtraBoldItalic.ttf'),
    RalewayMedium: require('../../assets/fonts/Raleway-Medium.ttf'),
    RalewayMediumItalic: require('../../assets/fonts/Raleway-MediumItalic.ttf'),
    RalewayLight: require('../../assets/fonts/Raleway-Light.ttf'),
    RalewayLightItalic: require('../../assets/fonts/Raleway-LightItalic.ttf'),
    RalewayRegular: require('../../assets/fonts/Raleway-Regular.ttf'),
    RalewaySemiBold: require('../../assets/fonts/Raleway-SemiBold.ttf'),
    RalewaySemiBoldItalic: require('../../assets/fonts/Raleway-SemiBoldItalic.ttf'),
    RalewayThin: require('../../assets/fonts/Raleway-Thin.ttf'),
    RalewayThinItalic: require('../../assets/fonts/Raleway-ThinItalic.ttf'),
  });

  if (!fontsLoaded) {
    return;
  }

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
    );
  }

  const queryClient = new QueryClient();

  return (
    <ClerkProvider tokenCache={ExpoSecureStoreClerkAdapter} publishableKey={publishableKey}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <BottomSheetModalProvider>
              <SessionProvider>
                <StatusBar style="light" />
                <Slot />
              </SessionProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
