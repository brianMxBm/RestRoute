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
        textClassName="font-medium text-center text-md"
        onPress={() => router.navigate('/login')}
        text="Get Started"
        className="mt-5 w-96 self-center rounded-full bg-yellow-500 px-2 py-5 "
      />
      <Button
        textClassName="text-md font-medium text-center max-w-lg text-gray-50"
        onPress={() => router.navigate('/douche')}
        text="Login"
        className="mt-5 w-96 self-center rounded-full border-dark-100 bg-dark-950 border-2 px-2 py-5 "
      />
    </View>
  );
}
