import { Stack } from 'expo-router';

import '../../global.css';
import { AuthProvider } from '../providers/Auth/AuthProvider';

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          animation: 'ios',
          headerShown: false,
        }}
      />
    </AuthProvider>
  );
}
