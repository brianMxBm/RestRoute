import { useAuth } from '@clerk/clerk-expo';
import { getUserByToken } from '@rest-route/api/src/queries';
import { Session } from '@rest-route/api/supabase/types/authType';
import { useRouter } from 'expo-router';
import { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { getSessionToken } from '../../../utils/auth/auth-service';

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

        if (isSignedIn) {
          router.replace('/home');
        } else {
          router.replace('/initial');
        }
      } catch (error) {
        console.error('Error fetching session token:', error);
        setLoading(false);
      }
    };

    initializeSession();
  }, [isSignedIn, getToken, router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return <SessionContext.Provider value={{ session }}>{props.children}</SessionContext.Provider>;
}

// const AuthContext = createContext<{
//   signOut: () => Promise<void>;
//   session: Session | null;
//   signInWithEmail: (email: string, password: string) => Promise<void>;
//   signUpWithEmail: (email: string, password: string) => Promise<void>;
// }>({
//   session: null,
//   signOut: () => Promise.resolve(),
//   signUpWithEmail: () => Promise.resolve(),
//   signInWithEmail: () => Promise.resolve(),
// });

// export function useAuthContext() {
//   const authContext = useContext(AuthContext);

//   if (!authContext) {
//     throw new Error('useAuthContext must be used within a AuthProvider');
//   }

//   return authContext;
// }

// export function AuthProvider(props: { children: ReactNode }) {
//   const router = useRouter();
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   //@TODO: Get some refresh token logic in here. Tired of my session expiring during development

//   const signUpWithEmail = async (email: string, password: string) => {
//     try {
//       await signUpUser({ email, password });
//     } catch (error) {
//       console.log(error);
//       throw new Error('Error signing up user');
//     }
//   };

//   const signInWithEmail = async (email: string, password: string) => {
//     try {
//       await signInUser({ email, password });
//     } catch (error) {
//       console.log(error);
//       throw new Error('Error signing in user');
//     }
//   };

//   useEffect(() => {
//     if (loading) return;

//     if (!session) {
//       //@laraandrew don't get routed to this screen after you've sense.
//       router.replace('/initial/');
//       return;
//     }

//     if (!session?.user?.onboarded) {
//       router.replace('/onboarding/');
//     } else {
//       router.replace('/(drawer)/(tabs)/(home)');
//     }
//   }, [loading, router, session]);

//   if (loading) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         signOut,
//         session,
//         signInWithEmail,
//         signUpWithEmail,
//       }}
//     >
//       {props.children}
//     </AuthContext.Provider>
//   );
// }
