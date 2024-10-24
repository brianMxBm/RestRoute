import { Stack } from 'expo-router';
import '../../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from '../providers/Auth/AuthProvider';

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack
          screenOptions={{
            animation: 'ios',
            headerShown: false,
          }}
        />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
