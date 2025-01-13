import { useAuth } from '@clerk/clerk-expo';
import { getUserByToken } from '@rest-route/api/src/queries';
import { Session } from '@rest-route/api/supabase/types/authType';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ReactNode, createContext, useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Button } from '../../components/primitives/Button';
import { Label } from '../../components/primitives/Label';

type SessionContextType = {
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, getToken, signOut: clerkSignOut } = useAuth();

  const {
    data: session,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user', isSignedIn],
    queryFn: async () => {
      if (!isSignedIn) return null;
      const token = await getToken({ template: 'database' });
      if (!token) return null;
      return getUserByToken({ jwt: token });
    },
    enabled: isSignedIn !== undefined,
  });

  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.replace('/(public)/initial');
    }
  }, [session, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Label className="text-lg ">Please check your internet and try again!</Label>
        <Button
          textClassName="text-md font-medium text-center text-gray-50 "
          onPress={() => refetch()}
          text="Retry?"
          className="mt-5 w-96 self-center rounded-full bg-dark-900 px-2 py-5"
        />
      </View>
    );
  }

  return (
    <SessionContext.Provider
      value={{
        session: session ?? null,
        isLoading,
        signOut: clerkSignOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}
