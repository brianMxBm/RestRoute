import { useSignUp } from '@clerk/clerk-expo';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { Stack, router, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Keyboard,
  TextInput,
} from 'react-native';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import Icon from 'react-native-vector-icons/FontAwesome6';

import { colors } from '../../../utils/style/colors';
import { Button } from '../../components/primitives/Button';

const CustomHeader = () => {
  const router = useRouter();

  return (
    <SafeAreaView>
      <View className="flex-row items-center justify-between  px-6">
        <TouchableOpacity onPress={() => router.back()} className=" justify-center">
          <Icon name="chevron-left" size={25} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function VerifyOTPScreen() {
  const [otpError, setOtpErorr] = useState<string>();
  const OTPInputRef = useRef<OtpInputRef>(null);

  const { signUp } = useSignUp();

  const isPhoneVerification = !!signUp?.phoneNumber;

  const onVerifyCode = async (pin: string) => {
    console.warn(signUp);
    try {
      if (isPhoneVerification) {
        await signUp.attemptPhoneNumberVerification({ code: pin });
      } else {
        await signUp?.attemptEmailAddressVerification({ code: pin });
      }

      router.navigate('/verify');
    } catch (error) {
      setOtpErorr('Invalid code');
      console.error(JSON.stringify(error, null, 2)); //@TODO: Handle errors and render them
    }
  };
  return (
    <>
      <SafeAreaView>
        <Stack.Screen
          options={{
            headerTransparent: true,
            headerShown: true,
            header: () => <CustomHeader />,
          }}
        />
      </SafeAreaView>

      <ScrollView contentContainerClassName="flex-1 px-6 justify-start pt-12">
        <View className="items-start max-w-96 gap-y-4">
          <Text className="text-4xl font-bold">Enter 6 Digit OTP</Text>
          <Text className="text-xl font-medium">Enter the code we sent to:</Text>
          <Text className="text-xl font-medium">818-480-1648</Text>
        </View>

        <View className="flex-1 items-center mt-10 ">
          <View className="gap-y-10 items-center">
            <OtpInput
              ref={OTPInputRef}
              numberOfDigits={6}
              onFilled={(pin) => onVerifyCode(pin)}
              autoFocus={true}
              type="numeric"
              focusColor={colors.dark[950]}
              theme={{
                pinCodeContainerStyle: {
                  borderColor: colors.gray[400],
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderTopWidth: 0,
                },
                focusedPinCodeContainerStyle: {
                  borderColor: colors.yellow[500],
                },
                filledPinCodeContainerStyle: {
                  borderColor: otpError ? 'red' : colors.dark[950],
                },
              }}
            />

            <Text>hey</Text>
          </View>

          <Button
            textClassName="text-md font-medium text-center text-dark-95 max-w-lg"
            onPress={() => router.navigate('/verify')}
            text="Resend Code In"
            className="mt-5 w-96 self-center rounded-full bg-yellow-500 px-2 py-5 border-gray-400"
          />
        </View>
      </ScrollView>
    </>
  );
}
