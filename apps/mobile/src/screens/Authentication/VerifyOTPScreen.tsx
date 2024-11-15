import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { createUser } from '@rest-route/api/src/mutations/createUser';
import { Stack, router } from 'expo-router';
import { useRef, useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import Icon from 'react-native-vector-icons/FontAwesome6';

import { colors } from '../../../utils/style/colors';
import { Button } from '../../components/primitives/Button';
import { Header } from '../../components/primitives/Header';

export default function VerifyOTPScreen() {
  const [otpError, setOtpError] = useState<string>();
  const OTPInputRef = useRef<OtpInputRef>(null);
  const { signUp, setActive, isLoaded } = useSignUp();

  const isPhoneVerification = !!signUp?.phoneNumber;

  const onVerifyCode = async (pin: string) => {
    try {
      if (!isLoaded) {
        return;
      }

      const result = isPhoneVerification
        ? await signUp?.attemptPhoneNumberVerification({ code: pin })
        : await signUp?.attemptEmailAddressVerification({ code: pin });

      if (result?.createdSessionId && result.createdUserId) {
        //TODO: This isn't needed. Refactor this
        setActive({
          session: result.createdSessionId,
        });

        createUser(result.createdUserId);
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        //@TODO: This should probably be a helper function
        switch (error.errors[0].code) {
          case 'verification_expired':
            setOtpError('This verification has expired. Please request a new code.');
            break;
          case 'invalid_verification':
            setOtpError('The code you entered is invalid. Please try again.');
            break;
          default:
            setOtpError('An unexpected error occurred. Please try again.');
        }
      }
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
            header: () => (
              <Header
                classNameHeaderContainer="px-6"
                leftHeader={
                  <TouchableOpacity onPress={() => router.back()} className=" justify-center">
                    <Icon name="chevron-left" size={25} />
                  </TouchableOpacity>
                }
              />
            ),
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

            <Text className="text-red-400 font-bold">{otpError}</Text>
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
