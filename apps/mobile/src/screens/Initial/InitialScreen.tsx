import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import AnimatedCarousel from './components/AnimatedCarousel';
import { Button } from '../../components/primitives/Button';

export default function InitialScreen() {
  return (
    <View className="flex-1 justify-center">
      <AnimatedCarousel />
      <Button
        textClassName="text-slate-50 text-center"
        onPress={() => router.navigate('/login')}
        text="Get Started"
        className="mt-5 w-96 self-center rounded-full bg-yellow-500 px-2 py-5 "
      />
      <Button
        textClassName="text-slate-50 text-center max-w-lg"
        onPress={() => router.navigate('/douche')}
        text="Create an account"
        className="mt-5 w-96 self-center rounded-full border-dark-100 border-2 px-2 py-5 "
      />
    </View>
  );
}
