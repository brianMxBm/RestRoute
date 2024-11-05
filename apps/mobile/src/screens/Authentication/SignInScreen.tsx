import { useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { CountryCode, AsYouType, parsePhoneNumber } from 'libphonenumber-js';
import { useState } from 'react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { z } from 'zod';

import { Country, CountryData } from '../../../utils/data/CountryData';
import { colors } from '../../../utils/style/colors';
import { Button } from '../../components/primitives/Button';
import { Input } from '../../components/primitives/Input';
import { Svg } from '../../components/primitives/Svg';

export default function SignUpScreen() {
  const [emailAuth, setEmailAuth] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);

  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

  const [country, setCountry] = useState<Country>({
    name: 'United States',
    dial_code: '+1',
    emoji: '🇺🇸',
    code: 'US',
    combinedLabel: '🇺🇸 United States (+1)',
  });

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
      if (!data.email && !data.phoneNumber) {
        throw Error('No email or phone number provided');
      }
      Keyboard.dismiss();
      await onSignUp(emailAuth ? data.email : data.phoneNumber);
    } catch (error) {
      console.warn(error);
    }
  };

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
          strategy: 'email_code', //@TODO: Look into email deep linking for verification.
        });
      } else {
        await signUp.create({ phoneNumber: authInfo }); // Replace with email input
        await signUp.preparePhoneNumberVerification({ strategy: 'phone_code' });
      }
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
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

      {!emailAuth && (
        <>
          <View className="w-96 self-center mt-5">
            <Dropdown
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              value={country}
              placeholder={!isFocus ? 'Select item' : '...'}
              labelField="combinedLabel" // Assuming `combinedLabel` can be used in `CountryData`
              valueField="dial_code"
              data={CountryData.map((item) => ({
                ...item,
                combinedLabel: `${item.emoji} ${item.name} (${item.dial_code})`,
              }))}
              key={'name'}
              renderItem={(item) => (
                <View
                  key={item.code}
                  style={{
                    overflow: 'hidden', // Ensure content stays within the item bounds
                  }}
                >
                  <Text style={{ fontSize: 15 }}>{item.combinedLabel}</Text>
                </View>
              )}
              itemContainerStyle={{
                paddingVertical: 15,
                paddingHorizontal: 15,
                overflow: 'hidden',
              }}
              iconColor={colors.dark[900]}
              iconStyle={{
                height: 25,
                width: 25,
              }}
              activeColor="transparent"
              showsVerticalScrollIndicator={false}
              closeModalWhenSelectedItem={true}
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
              onChange={(item) => {
                setCountry(item);
              }}
            />
          </View>
        </>
      )}

      {emailAuth ? (
        <Controller
          control={form.control}
          name="email"
          render={({ field, formState }) => (
            <Input
              autoCapitalize={'none'}
              value={field.value}
              className="w-96 self-center"
              classNameInputContainer="mt-5 rounded-full border-gray-400 bg-gray-50 px-4 py-5 border-1"
              hasError={!!formState.errors.email}
              errorMessage={formState.errors.email?.message}
              onChangeText={field.onChange}
              placeholder="Email address"
              placeholderTextColor={colors.gray[600]}
              keyboardType="email-address"
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
              className="w-96 self-center"
              classNameInputContainer="mt-5 rounded-full border-gray-400 bg-gray-50 px-4 py-5 border-1"
              hasError={!!formState.errors.phoneNumber}
              errorMessage={formState.errors.phoneNumber?.message}
              onChangeText={(text) => {
                const formattedNumber = formatPhoneNumber(text);
                field.onChange(formattedNumber);
              }}
              placeholder="Phone number"
              placeholderTextColor={colors.gray[600]}
              keyboardType="phone-pad"
            />
          )}
        />
      )}

      <Button
        textClassName="text-md font-medium text-center text-dark-95 max-w-lg "
        onPress={() => form.handleSubmit(onValid, onError)()}
        text="Continue"
        className="mt-5 w-96 self-center rounded-full bg-yellow-500  px-2 py-5 border-gray-400 "
      />

      <View className="flex-row items-center mt-4 ">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="text-gray-400 mx-2">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <Button
        textClassName="text-md font-medium text-center max-w-lg text-dark-950"
        onPress={onSwitchAuth}
        text={`Continue with ${emailAuth ? 'Phone' : 'Email'}`}
        leftChild={<Icon size={20} name={emailAuth ? 'phone' : 'envelope'} />}
        className="mt-5 w-96 flex-row items-center gap-x-5 rounded-full border-gray-400 border-1 bg-gray-50 px-2 py-5"
      />

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
