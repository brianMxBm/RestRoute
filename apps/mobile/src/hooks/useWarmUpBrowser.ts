import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/*
@SEE: Warm up the android browser to improve UX
Refer: https://docs.expo.dev/guides/authentication/#improving-user-experience
*/

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Warm up the Android browser to improve UX
      WebBrowser.warmUpAsync();
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);
};
