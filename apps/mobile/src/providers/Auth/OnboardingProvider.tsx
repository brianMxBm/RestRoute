import { useRouter } from 'expo-router';
import { ReactNode, useState, useEffect, createContext } from 'react';
import { View, ActivityIndicator } from 'react-native';

const OnboardingContext = createContext<object>({});

export function OnboardingProvider(props: { children: ReactNode }) {
  const router = useRouter();
  //   const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    router.navigate('/');
  }, []);

  return <OnboardingContext.Provider value={{}}>{props.children}</OnboardingContext.Provider>;
}
