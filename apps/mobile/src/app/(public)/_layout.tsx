import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useSessionContext } from '../../providers/Auth/SessionProvider';

export default function PublicLayout() {
  const { session, isLoading } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      // Ensure we're on the initial screen when there's no session
      router.replace('/(public)/initial');
      return;
    }

    const route = session.user.onboarded ? '/(public)/' : '/(auth)/onboarding';

    router.replace(route);
  }, [session, isLoading]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
