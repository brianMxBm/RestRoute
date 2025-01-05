import { useAuth } from '@clerk/clerk-expo';
import { getUserByToken } from '@rest-route/api/src/queries';
import { Session } from '@rest-route/api/supabase/types/authType';
import { useRouter } from 'expo-router';
import { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';

const SessionContext = createContext<{
  session: Session | null;
  signOut?: () => void;
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
  const [loading, setLoading] = useState<boolean>(true);

  const { isSignedIn, getToken, signOut: clerkSignOut } = useAuth();

  const router = useRouter();

  const signOut = async () => {
    try {
      await clerkSignOut();
    } catch (error) {
      //@SEE: Add error toasts.
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const token = await getToken();
        if (!token && !isSignedIn) {
          router.replace('/initial');
          return;
        }

        const sessionData = await getUserByToken(token || '');
        setSession(sessionData);

        if (!session?.user.onboarded) {
          router.replace('/onboarding');
        }

        setLoading(false);
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

  return (
    <SessionContext.Provider value={{ session, signOut }}>{props.children}</SessionContext.Provider>
  );
}
