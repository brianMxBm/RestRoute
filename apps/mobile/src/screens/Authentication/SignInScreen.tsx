import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Linking from 'expo-linking';
import { Stack, useRouter } from 'expo-router';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import { CountryCode, AsYouType, parsePhoneNumber } from 'libphonenumber-js';
import { useCallback, useState } from 'react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { View, Text, TouchableOpacity, Keyboard, ScrollView, SafeAreaView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { z } from 'zod';

import { Country, CountryData } from '../../../utils/data/CountryData';
import { colors } from '../../../utils/style/colors';
import { Button } from '../../components/primitives/Button';
import { Header } from '../../components/primitives/Header';
import { Input } from '../../components/primitives/Input';
import { Svg } from '../../components/primitives/Svg';
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';

maybeCompleteAuthSession();

//@TODO: There's a huge oversight here, if the user logs out and attempts to sign in again clerk doesn't allow it. Look into configurations on dashboard.

export default function SignUpScreen() {
  const [emailAuth, setEmailAuth] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [country, setCountry] = useState<Country>({
    name: 'United States',
    dial_code: '+1',
    emoji: '🇺🇸',
    code: 'US',
    combinedLabel: '🇺🇸 United States (+1)',
  });

  useWarmUpBrowser();
  const { isLoaded, signUp } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  const formSchema = z.object({
    //@SEE: This validation schema needs some refinement.
    phoneNumber: !emailAuth
      ? z
          .string()
          .trim()
          .refine(
            (value) => {
              if (!value) return false;
              const phoneNumber = parsePhoneNumber(value, {
                defaultCountry: country.code as CountryCode,
              });
              return phoneNumber?.isValid() ?? false;
            },
            { message: 'Invalid phone number' }
          )
          .transform((value, ctx) => {
            try {
              const phoneNumber = parsePhoneNumber(value, {
                defaultCountry: country.code as CountryCode,
              });
              if (!phoneNumber?.isValid()) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Invalid phone number format',
                });
                return z.NEVER;
              }
              return phoneNumber.formatInternational();
            } catch (error) {
              console.warn(error);
            }
          })
      : z.string().optional(),

    email: emailAuth
      ? z.string().email('Please enter a valid email address')
      : z.string().optional(),
  });

  type Form = z.infer<typeof formSchema>;

  const form = useForm<Form>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      email: '',
    },
  });

  const onValid = async (data: Form) => {
    console.warn(data);
    try {
      Keyboard.dismiss();

      const authInfo = emailAuth ? data.email : data.phoneNumber;

      if (!authInfo) {
        //@TODO: Handle this error in a cleaner way
        return;
      }

      onSignUp(authInfo);

      router.navigate('/verify');
    } catch (error) {
      console.warn(error);
    }
  };

  const onOAuthPress = useCallback(async () => {
    //@TODO: Come back and finalize this flow, Google API isn't listing the correct information in the webview
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'rest-routeDev' }), //@TODO: This scheme needs to change for production
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const onSwitchAuth = () => {
    Keyboard.dismiss();
    setEmailAuth(!emailAuth);
    form.reset(); // Reset form values on switch
  };

  const onError = async (error: FieldErrors<Form>) => {
    console.warn(error);
  };

  const onSignUp = async (authInfo: string) => {
    try {
      if (!isLoaded) {
        return;
      }

      if (emailAuth) {
        await signUp.create({ emailAddress: authInfo }); // Replace with email input
        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code', //@TODO: Look into email deep linki ng for verification.
        });
      } else {
        await signUp.create({ phoneNumber: authInfo }); // Replace with email input
        await signUp.preparePhoneNumberVerification({ strategy: 'phone_code' });
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const formatPhoneNumber = (text: string) => {
    try {
      const formatter = new AsYouType({ defaultCountry: country.code as CountryCode });
      return formatter.input(text);
    } catch (error) {
      console.error(error);
      return text;
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
        <View className="items-start gap-y-2">
          <Text className="text-4xl font-bold">Login To RestRoute</Text>
        </View>

        <View className={`${!emailAuth && 'mt-5'}`}>
          {!emailAuth && (
            <View className="w-full">
              <Dropdown //@TODO: Abstract this to a component.
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                value={country}
                placeholder={!isFocus ? 'Select item' : '...'}
                labelField="combinedLabel"
                valueField="dial_code"
                data={CountryData.map((item) => ({
                  ...item,
                  combinedLabel: `${item.emoji} ${item.name} (${item.dial_code})`,
                }))}
                key={'name'}
                renderItem={(item) => (
                  <View key={item.code} style={{ overflow: 'hidden' }}>
                    <Text style={{ fontSize: 15 }}>{item.combinedLabel}</Text>
                  </View>
                )}
                itemContainerStyle={{
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  overflow: 'hidden',
                }}
                iconColor={colors.dark[900]}
                iconStyle={{ height: 25, width: 25 }}
                activeColor="transparent"
                showsVerticalScrollIndicator={false}
                closeModalWhenSelectedItem
                style={{
                  borderRadius: 9999,
                  borderWidth: 1,
                  overflow: 'hidden',
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  borderColor: colors.gray[400],
                  backgroundColor: colors.gray[50],
                }}
                containerStyle={{
                  borderRadius: 30,
                  marginTop: 5,
                  shadowColor: colors.dark[500],
                  shadowRadius: 5,
                }}
                onChange={(item) => setCountry(item)}
              />
            </View>
          )}

          {emailAuth ? (
            <Controller
              control={form.control}
              name="email"
              render={({ field, formState }) => (
                <Input
                  autoCapitalize="none"
                  value={field.value}
                  className="w-full self-center"
                  classNameInputContainer={`mt-5 rounded-full bg-gray-50 px-4 py-5 border-1 ${formState.errors.email ? `border-red-500` : `border-gray-400`}`}
                  hasError={!!formState.errors.email}
                  errorMessage={formState.errors.email?.message}
                  onChangeText={field.onChange}
                  classNameErrorContainer={`ml-2 my-2  ${!formState.errors.email && 'hidden'}`}
                  placeholder="Email address"
                  placeholderTextColor={colors.gray[600]}
                  keyboardType="email-address"
                  showError
                />
              )}
            />
          ) : (
            <Controller
              control={form.control}
              name="phoneNumber"
              render={({ field, formState }) => (
                <Input
                  value={field.value}
                  className="w-full self-center"
                  classNameInputContainer={`mt-5 rounded-full bg-gray-50 px-4 py-5 border-1 ${formState.errors.phoneNumber ? `border-red-500` : `border-gray-400`}`}
                  hasError={!!formState.errors.phoneNumber}
                  errorMessage={formState.errors.phoneNumber?.message}
                  onChangeText={(text) => {
                    const formattedNumber = formatPhoneNumber(text);
                    field.onChange(formattedNumber);
                  }}
                  classNameErrorContainer={`ml-2 my-2  ${!formState.errors.phoneNumber && 'hidden'}`}
                  placeholder="Phone number"
                  placeholderTextColor={colors.gray[600]}
                  keyboardType="phone-pad"
                  showError
                />
              )}
            />
          )}

          <Text className="text-sm font-normal pl-2 mt-1 ">
            We'll send a verification code to your {emailAuth ? 'email' : 'phone number'} to confirm
            it's you
          </Text>

          <Button
            textClassName="text-md font-medium text-center text-dark-95 "
            // onPress={() => router.navigate('/verify')}
            onPress={() => form.handleSubmit(onValid, onError)()}
            text="Continue"
            className="mt-5 w-96 self-center rounded-full bg-yellow-500 px-2 py-5 border-gray-400"
          />

          <View className="flex-row items-center mt-4">
            <View className="flex-1 h-px bg-gray-400" />
            <Text className="text-gray-900 mx-2">or</Text>
            <View className="flex-1 h-px bg-gray-400" />
          </View>

          <Button
            textClassName="text-md font-medium text-center max-w-lg text-dark-950"
            onPress={onSwitchAuth}
            text={`Continue with ${emailAuth ? 'Phone' : 'Email'}`}
            leftChild={<Icon size={20} name={emailAuth ? 'phone' : 'envelope'} />}
            className="mt-5 w-96 flex-row items-center gap-x-5 rounded-full border-gray-400 border-1 bg-gray-50 px-2 py-5"
          />

          <Button
            textClassName="text-md font-medium text-center max-w-lg text-dark-950"
            onPress={() => onOAuthPress()} //@TODO: Pass in param to dynamically have a single function for OAuth
            leftChild={<Svg size={20} name="googleLogo" />}
            text="Continue with Google"
            className="mt-5 w-96 flex-row items-center gap-x-5 rounded-full border-gray-400 bg-gray-50 border-1 px-2 py-5"
          />
        </View>
      </ScrollView>
    </>
  );
}
