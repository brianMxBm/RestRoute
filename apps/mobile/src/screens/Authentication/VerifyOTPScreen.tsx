import { isClerkAPIResponseError, useAuth, useSignUp } from '@clerk/clerk-expo';
import { createUser } from '@rest-route/api/src/mutations/createUser';
import { useMutation } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, Text, ScrollView, SafeAreaView, Keyboard } from 'react-native';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import Icon from 'react-native-vector-icons/FontAwesome6';

import { colors } from '../../../utils/style/colors';
import { formatSecondsAsTimer } from '../../../utils/time/time-service';
import { Button } from '../../components/primitives/Button';
import { Header } from '../../components/primitives/Header';

export default function VerifyOTPScreen() {
  const [otpError, setOtpError] = useState<string>();
  const [counter, setCounter] = useState(300);
  const { getToken } = useAuth();

  const OTPInputRef = useRef<OtpInputRef>(null);
  const { signUp, setActive, isLoaded } = useSignUp();

  const isPhoneVerification = !!signUp?.phoneNumber;
  const initialValue = signUp?.emailAddress || signUp?.phoneNumber;

  useEffect(() => {
    // Keep keyboard up
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Force keyboard to show
      OTPInputRef.current?.focus();
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const createUserMutaton = useMutation({
    mutationFn: createUser,
    onError: (error) => {
      console.error(error);
      setOtpError('Failed');
    },
  });

  const onVerifyCode = async (pin: string) => {
    try {
      if (!isLoaded) {
        return;
      }

      const result = isPhoneVerification
        ? await signUp?.attemptPhoneNumberVerification({ code: pin })
        : await signUp?.attemptEmailAddressVerification({ code: pin });

      if (result?.createdSessionId && result.createdUserId) {
        await setActive({ session: result.createdSessionId });

        const token = await getToken();

        if (!token) {
          throw new Error('Failed to retrieve token');
        }

        await createUserMutaton.mutateAsync({
          jwt: token,
          clerkId: result.createdUserId,
        });
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        console.log(error);
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
      console.log(error);
    }
  };

  const handleResendVerificationCode = async () => {
    try {
      if (!isLoaded) {
        return;
      }

      if (isPhoneVerification) {
        await signUp?.preparePhoneNumberVerification();
      } else {
        await signUp?.prepareEmailAddressVerification();
      }

      setCounter(300);
      setOtpError(undefined);
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        switch (error.errors[0].code) {
          case 'resend_limit_reached':
            setOtpError('You have reached the limit for resending codes. Please try again later.');
            break;
          default:
            setOtpError('Failed to resend verification code. Please try again.');
        }
      }
    }
  };

  useEffect(
    function startCounter() {
      const interval = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);

      function clearStartCount() {
        clearInterval(interval);
      }

      if (counter === 0) {
        clearStartCount();
      }

      return clearStartCount;
    },
    [counter]
  );

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
          <Text className="text-xl font-medium">{initialValue}</Text>
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
            disabled={counter > 0}
            textClassName="text-md font-medium text-center text-dark-95 max-w-lg"
            onPress={handleResendVerificationCode} // Call the resend handler function
            text={`Resend Code ${counter > 0 ? `in ${formatSecondsAsTimer(counter)}` : ''}`}
            className="mt-5 w-96 self-center rounded-full bg-yellow-500 px-2 py-5 border-gray-400"
          />
        </View>
      </ScrollView>
    </>
  );
}
