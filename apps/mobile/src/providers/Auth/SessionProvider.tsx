import { useAuth } from '@clerk/clerk-expo';
import { getUserByToken } from '@rest-route/api/src/queries';
import { Session } from '@rest-route/api/supabase/types/authType';
import { useRouter } from 'expo-router';
import { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';

const SessionContext = createContext<{
  session: Session | null;
}>({
  session: null,
});

export function useSessionContext() {
  const sessionContext = useContext(SessionContext);

  if (!sessionContext) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }

  return sessionContext;
}

export function SessionProvider(props: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { isSignedIn, getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const token = await getToken();
        if (!token && !isSignedIn) {
          setLoading(false);
          router.replace('/initial');
          return;
        }

        const sessionData = await getUserByToken(token || '');

        setSession(sessionData);
        setLoading(false);

        if (!isSignedIn) {
          router.replace('/initial');
        }

        if (!session?.user.onboarded) {
          router.replace('/onboarding');
        } else {
          router.replace('/map');
        }
      } catch (error) {
        console.error('Error fetching session token:', error);
        setLoading(false);
      }
    };

    initializeSession();
  }, [isSignedIn]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return <SessionContext.Provider value={{ session }}>{props.children}</SessionContext.Provider>;
}
