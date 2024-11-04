import { useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { z } from 'zod';

import { colors } from '../../../utils/style/colors';
import { Button } from '../../components/primitives/Button';
import { Input } from '../../components/primitives/Input';
import { Svg } from '../../components/primitives/Svg';

const formSchema = z.object({
  phoneNumber: z.string({ message: 'Enter a valid phone number' }),
  email: z.string().optional(),
});

type Form = z.infer<typeof formSchema>;

export default function SignUpScreen() {
  const [authMethod, setAuthMethod] = useState<'sms' | 'email'>('email');

  const { isLoaded, signUp, setActive } = useSignUp();

  const router = useRouter();

  const [phoneNumber, setphoneNumber] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      email: '',
    },
  });

  const onValid = async (data: Form) => {
    try {
      Keyboard.dismiss();

      console.warn('hey');
    } catch (error) {
      console.warn(error);
    }
  };

  const onSwitchAuth = () => {
    Keyboard.dismiss();
    setAuthMethod('sms');
  };

  const onError = async (error: FieldErrors<Form>) => {
    console.warn(error);
  };

  // const onSignUpPress = async () => {
  //   if (!isLoaded) {
  //     return;
  //   }

  //   try {
  //     await signUp({
  //       phoneNumber,
  //     });

  //     await signUp.preparePhoneNumberVerification({ strategy: 'phone_code' });

  //     setPendingVerification(true);
  //   } catch (err: any) {
  //     // See https://clerk.com/docs/custom-flows/error-handling
  //     // for more info on error handling
  //     console.error(JSON.stringify(err, null, 2));
  //   }
  // };

  // const onPressVerify = async () => {
  //   if (!isLoaded) {
  //     return;
  //   }

  //   try {
  //     const completeSignUp = await signUp.attemptPhoneNumberVerification({
  //       code,
  //     });

  //     if (completeSignUp.status === 'complete') {
  //       await setActive({ session: completeSignUp.createdSessionId });
  //       router.replace('/');
  //     } else {
  //       console.error(JSON.stringify(completeSignUp, null, 2));
  //     }
  //   } catch (err: any) {
  //     // See https://clerk.com/docs/custom-flows/error-handling
  //     // for more info on error handling
  //     console.error(JSON.stringify(err, null, 2));
  //   }
  // };

  return (
    <View className="px-5 flex-1 pt-32">
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerShown: true,
          title: '',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Icon name="chevron-left" size={25} />
            </TouchableOpacity>
          ),
          headerRight: () => <Text className="mt-2 text-xl">Skip</Text>, // TODO: Only show this after a few seconds.
        }}
      />

      <View className="items-start gap-y-2">
        <Text className="text-4xl font-bold text-">Hey!</Text>
        <Text className="text-4xl font-bold">Welcome To RestRoute!</Text>
      </View>

      <Button
        textClassName="text-md font-medium text-center max-w-lg font-medium text-dark-950"
        onPress={() => router.navigate('/douche')}
        leftChild={<Svg size={20} name={'googleLogo'} />}
        text="Continue with Google"
        className="mt-5 w-96  flex-row items-center gap-x-5 rounded-full border-gray-400 bg-gray-50 border-1 px-4 py-5 "
      />

      {authMethod === 'sms' ? (
        <Controller
          control={form.control}
          name="phoneNumber"
          render={({ field, formState }) => (
            <Input
              maxLength={40}
              value={field.value}
              showError={true}
              className="w-96 self-center"
              classNameInputContainer="mt-5 flex-row items-center rounded-full border-gray-400 bg-gray-50 border-1 px-4 py-5"
              hasError={!!formState.errors.phoneNumber}
              errorMessage={form.formState.errors.phoneNumber?.message}
              onChangeText={field.onChange}
              textContentType="telephoneNumber"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.gray[600]}
              placeholder="Phone number"
              returnKeyType="done"
              keyboardType="number-pad"
            />
          )}
        />
      ) : (
        <Controller
          control={form.control}
          name="email"
          render={({ field, formState }) => (
            <Input
              value={field.value}
              showError={true}
              className="w-96 self-center"
              classNameInputContainer="mt-5 flex-row items-center rounded-full border-gray-400 bg-gray-50 border-1 px-4 py-5"
              hasError={!!formState.errors.email}
              errorMessage={form.formState.errors.email?.message}
              onChangeText={field.onChange}
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.gray[600]}
              placeholder="Email address"
              returnKeyType="done"
              keyboardType="default"
            />
          )}
        />
      )}

      <Button
        textClassName="text-md font-medium text-center max-w-lg text-gray-50"
        onPress={() => form.handleSubmit(onValid, onError)()}
        text="Continue"
        className="mt-5 w-96 self-center rounded-full border-dark-100 bg-dark-500 border-2 px-2 py-5 "
      />

      <View className="flex-row items-center mt-4 ">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="text-gray-400 mx-2">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {authMethod === 'sms' ? (
        <Button
          textClassName="text-md font-medium text-center max-w-lg font-medium text-dark-950"
          onPress={() => onSwitchAuth()}
          text="Continue with Email"
          leftChild={<Icon size={20} name="envelope" />}
          className="mt-5 w-96 flex-row items-center gap-x-5 rounded-full border-gray-400 bg-gray-50 border-1 px-2 py-5 "
        />
      ) : (
        <Button
          textClassName="text-md font-medium text-center max-w-lg font-medium text-dark-950"
          onPress={() => onSwitchAuth()}
          text="Continue with Number"
          leftChild={<Icon size={20} name="phone" />}
          className="mt-5 w-96 flex-row items-center gap-x-5 rounded-full border-gray-400 bg-gray-50 border-1 px-2 py-5 "
        />
      )}

      <Button
        textClassName="text-md font-medium text-center max-w-lg font-medium text-dark-950"
        onPress={() => router.navigate('/douche')}
        leftChild={<Svg size={20} name={'googleLogo'} />}
        text="Continue with Google"
        className="mt-5 w-96 flex-row items-center gap-x-5 rounded-full border-gray-400 bg-gray-50 border-1 px-2 py-5 "
      />
    </View>
  );
}

/*
  {!pendingVerification && (
        <>
          <Input
            className="w-10/12 rounded-full border-0"
            autoCapitalize="none"
            value={phoneNumber}
            placeholder="Email..."
            onChangeText={(phoneNumber) => setphoneNumber(phoneNumber)}
          />
        </>
      )}
      {pendingVerification && (
        <>
          <TextInput value={code} placeholder="Code..." onChangeText={(code) => setCode(code)} />
          <Button title="Verify Email" onPress={onPressVerify} />
        </>
      )}

*/
